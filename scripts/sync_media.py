#!/usr/bin/env python3
"""Atualiza dados públicos de capas e pôsteres: execute pelo GitHub Actions.
Secrets necessários: TMDB_API_TOKEN (Bearer), LASTFM_API_KEY.
Não grava credenciais no repositório.
"""
import json, os, urllib.parse, urllib.request, pathlib, time
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/data/media.json'
TOKEN=os.environ.get('TMDB_API_TOKEN','')
LASTFM=os.environ.get('LASTFM_API_KEY','')
TARGETS={
  1: ('music','Bon Jovi','Slippery When Wet'),
  2: ('music','Gavin DeGraw','Gavin DeGraw'),
  3: ('music','Silverchair','Neon Ballroom'),
  7: ('movie','Dumb and Dumber',1994),
  8: ('movie','The Matrix',1999),
  9: ('movie','Toy Story',1995),
  13: ('tv','Friends',1994),
  14: ('tv','The X-Files',1993),
  15: ('tv',"Dawson's Creek",1998),
}
def request(url,auth=False):
    headers={'User-Agent':'BrunoVerse/1.0 (personal non-commercial collection)','Accept':'application/json'}
    if auth:headers['Authorization']='Bearer '+TOKEN
    r=urllib.request.Request(url,headers=headers)
    with urllib.request.urlopen(r,timeout=25) as f:return json.load(f)
def tmdb(kind,title,year):
    if not TOKEN:return None
    params={'query':title,'language':'pt-BR','include_adult':'false',('first_air_date_year' if kind=='tv' else 'year'):str(year)}
    data=request('https://api.themoviedb.org/3/search/'+kind+'?'+urllib.parse.urlencode(params),True)
    entries=data.get('results',[])
    entries=[e for e in entries if (e.get('first_air_date' if kind=='tv' else 'release_date') or '').startswith(str(year))] or entries
    if not entries:return None
    e=entries[0]; poster=e.get('poster_path');return {'image':('https://image.tmdb.org/t/p/w500'+poster) if poster else None,'source':'TMDb','sourceUrl':f"https://www.themoviedb.org/{kind}/{e['id']}", 'synopsis':e.get('overview','') or None, 'credit':'Dados e imagem: TMDb'}
def lastfm(artist,album):
    if not LASTFM:return None
    q=urllib.parse.urlencode({'method':'album.getinfo','api_key':LASTFM,'artist':artist,'album':album,'autocorrect':'1','format':'json'})
    data=request('https://ws.audioscrobbler.com/2.0/?'+q).get('album',{})
    images=data.get('image',[])
    image=next((v.get('#text') for v in reversed(images) if v.get('#text','').startswith('https://')),None)
    if not image:return None
    return {'image':image,'source':'Last.fm','sourceUrl':data.get('url') or 'https://www.last.fm','credit':'Capa e dados: Last.fm'}
def main():
    try:result=json.loads(OUT.read_text(encoding='utf-8'))
    except (OSError,ValueError):result={}
    for key,task in TARGETS.items():
        kind,a,b=task
        try:record=lastfm(a,b) if kind=='music' else tmdb(kind,a,b)
        except Exception as exc:print(f'Não foi possível atualizar {key}: {exc}');record=None
        if record and record.get('image'):
            result[str(key)]=record
            print(f'Atualizado: {key} -> {record["source"]}')
        else:print(f'Sem imagem para {key}; mantido fallback/resultado anterior')
        time.sleep(.2)
    OUT.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
if __name__=='__main__':main()
