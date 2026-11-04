#!/usr/bin/env python3
"""Election-night results for every race on the On the Road log, plus MN-06.

Reads articles/on-the-road/data.json for the race list, pulls vote counts and
race calls from NBC News's state results pages and win odds from Kalshi's
public market API, and writes articles/on-the-road/results/results.json.

Standard library only. Run from the repo root:
    python3 tools/election_results.py
"""
import json, os, re, sys, time, urllib.request, urllib.error
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'articles', 'on-the-road', 'data.json')
OUT = os.path.join(ROOT, 'articles', 'on-the-road', 'results', 'results.json')
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
STATES = {'AL':'alabama','AZ':'arizona','CA':'california','CO':'colorado','FL':'florida','GA':'georgia','IA':'iowa','IL':'illinois',
          'IN':'indiana','KS':'kansas','KY':'kentucky','ME':'maine','MI':'michigan','MN':'minnesota','MO':'missouri','NC':'north-carolina',
          'NE':'nebraska','NJ':'new-jersey','NM':'new-mexico','NV':'nevada','NY':'new-york','OH':'ohio','OR':'oregon','PA':'pennsylvania',
          'SC':'south-carolina','TN':'tennessee','TX':'texas','VA':'virginia','WA':'washington','WI':'wisconsin'}

def get(url, tries=3, pause=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*'})
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read().decode('utf-8')
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            time.sleep(pause * (i + 1))
        except Exception:
            time.sleep(pause * (i + 1))
    return None

def nbc_state(slug):
    """District number -> {pct_in, cands:[{name, party, votes, pct, winner}]} from NBC's page data."""
    html = get('https://www.nbcnews.com/politics/2026-elections/%s-house-results' % slug)
    if not html:
        return None
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    if not m:
        return None
    out = {}
    def walk(o):
        if isinstance(o, list):
            for x in o: walk(x)
        elif isinstance(o, dict):
            name = o.get('name')
            if isinstance(name, str) and re.fullmatch(r'District \d+', name) and isinstance(o.get('candidates'), list):
                d = int(name.split()[1])
                rec = {'pct_in': o.get('percentIn') or 0,
                       'cands': [{'name': c.get('name'), 'party': c.get('party'), 'votes': c.get('votes') or 0,
                                  'pct': c.get('percentVote') or 0, 'winner': bool(c.get('isWinner'))} for c in o['candidates']]}
                if d not in out or rec['pct_in'] >= out[d]['pct_in']:
                    out[d] = rec
            for v in o.values(): walk(v)
    walk(json.loads(m.group(1)))
    return out

def kalshi(dist):
    """Kalshi win odds (cents = percent) by party for one district, or None."""
    st, n = dist.split('-')
    for t in ('KXHOUSERACE-%s%s-26' % (st, n), 'HOUSE%s%d-26' % (st, int(n))):
        body = get('https://api.elections.kalshi.com/trade-api/v2/events/%s?with_nested_markets=true' % t, tries=3, pause=2)
        time.sleep(0.8)
        if not body:
            continue
        row = {'ticker': t}
        for mk in json.loads(body)['event']['markets']:
            txt = ' '.join(str(mk.get(k, '')) for k in ('rules_primary', 'yes_sub_title', 'title'))
            party = 'D' if 'Democrat' in txt else 'R' if 'Republican' in txt else None
            if not party:
                continue
            bid = float(mk.get('yes_bid_dollars') or 0); ask = float(mk.get('yes_ask_dollars') or 0)
            last = float(mk.get('last_price_dollars') or 0)
            price = (bid + ask) / 2 if 0 < bid <= ask < 1 else last
            row[party] = round(price * 100)
            if mk.get('result'):
                row[party + '_result'] = mk['result']
        return row
    return None

def main():
    d = json.load(open(DATA))
    races = []
    for s in d['stops']:
        for r in (s.get('races') or [s]):
            if any(x['district'] == r['district'] for x in races):
                continue
            m = r['money']
            opp = r.get('opponent', '')
            mo = re.match(r'^(.*?\((?:D|DFL|R|I|L)\))', opp)
            opp = mo.group(1) if mo else opp
            races.append({'district': r['district'], 'candidate': r['candidate'], 'opponent': opp,
                          'cook': r['race']['rating'], 'money': round(m['campaign'] + m['pac'] + m['jfc']), 'visited': s['date']})
    races.append({'district': 'MN-06', 'candidate': 'Rep. Tom Emmer', 'opponent': 'Doug Chapin (DFL)',
                  'cook': d['homeRace']['rating'], 'money': 0, 'visited': '', 'home': True})

    prev = {}
    if os.path.exists(OUT):
        try:
            prev = {r['district']: r for r in json.load(open(OUT))['races']}
        except Exception:
            prev = {}

    states = {}
    for st in sorted({r['district'][:2] for r in races}):
        states[st] = nbc_state(STATES[st])
        time.sleep(1)

    rows = []
    for r in races:
        st, n = r['district'][:2], int(r['district'][3:])
        res = (states.get(st) or {}).get(n)
        if res is None and r['district'] in prev:
            row = dict(prev[r['district']]); row['stale'] = True
        else:
            res = res or {'pct_in': 0, 'cands': []}
            gop = next((c for c in res['cands'] if c['party'] == 'gop'), {})
            dem = next((c for c in res['cands'] if c['party'] == 'dem'), {})
            rp, dp = gop.get('pct', 0), dem.get('pct', 0)
            if gop.get('winner'): status = 'Won'
            elif dem.get('winner'): status = 'Lost'
            elif res['pct_in'] == 0 and rp == 0 and dp == 0: status = 'No votes yet'
            elif rp > dp: status = 'Leading'
            elif rp < dp: status = 'Trailing'
            else: status = 'Tied'
            row = dict(r, pct_in=res['pct_in'], r_pct=rp, d_pct=dp, margin=round(rp - dp, 1),
                       r_votes=gop.get('votes', 0), d_votes=dem.get('votes', 0), status=status,
                       r_name=gop.get('name', ''), d_name=dem.get('name', ''))
        k = kalshi(r['district'])
        if k:
            row['kalshi_r'] = k.get('R'); row['kalshi_d'] = k.get('D'); row['kalshi_ticker'] = k['ticker']
        elif r['district'] in prev:
            for f in ('kalshi_r', 'kalshi_d', 'kalshi_ticker'):
                if f in prev[r['district']]: row[f] = prev[r['district']][f]
        rows.append(row)

    out = {'updated': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
           'source': {'results': 'NBC News (vote counts and NBC News Decision Desk race calls)', 'odds': 'Kalshi public market prices'},
           'races': rows}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    tmp = OUT + '.tmp'
    json.dump(out, open(tmp, 'w'), indent=1)
    os.replace(tmp, OUT)
    from collections import Counter
    c = Counter(x['status'] for x in rows if not x.get('home'))
    home = next(x for x in rows if x.get('home'))
    print(out['updated'], dict(c), 'MN-06:', home['status'], home.get('r_pct'), home.get('d_pct'), home.get('pct_in'), '% in')

if __name__ == '__main__':
    main()
