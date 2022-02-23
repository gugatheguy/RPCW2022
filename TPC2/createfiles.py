import json

from numpy import tile

def create_movie_page(id,filme,atores):
    f = open("archive/filmes/"+id+".html","w")
    f.write(f'''<!DOCTYPE html>
<html>
    <head>
        <title>{filme["title"]}</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    </head>
    <body>
        <div class="w3-container" >
            <h2>{filme['title']}</h2>
            <p><b>Ano:</b>{filme['year']}</p>
            <p><b>Elenco:</b></p>
            <ul class="w3-ul w3-hoverable">\n''')
    for e in filme['cast']:
        f.write(f'''\t\t\t\t<li><a href="../atores/{atores[e]['id']}.html">{e}</a></li>\n''')
    f.write(f'''\t\t\t</ul>
            <p> <b>Géneros:</b></p>
            <ul class="w3-ul w3-hoverable">\n''')
    for e in filme['genres']:
        f.write(f"\t\t\t\t<li>{e}</li>\n")
    f.write(f'''\t\t\t</ul>
            <a href="index.html" class="w3-button w3-teal w3-hover-gray w3-round-large">Voltar para a lista de filmes</a>
        </div>
    </body>
</html>''')


def create_movie_index(filmes):
    f = open("archive/filmes/index.html","w")
    f.write('''<!DOCTYPE html>
<html>
    <head>
        <title>Lista de filmes</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    </head>
    <body>
        <div class="w3-panel w3-teal" id="title">
            <h1 class="w3-opacity" style="text-align: center;"><b>Filmes:</b></h1>
        </div>
        <div class="w3-container" >
            <ul class="w3-ul w3-hoverable">\n''')
    filmes_sorted = dict(sorted(filmes.items(), key=lambda x: x[1]['title']))
    for key in filmes_sorted:
        f.write(f'''\t\t\t\t<li><a href="{key}.html">{filmes_sorted[key]['title']}</a></li>\n''')
    f.write(f'''\t\t\t</ul>
            <a href="#title" class="w3-button w3-teal w3-hover-gray w3-round-large">Voltar para o topo</a>
        </div>
    </body>
</html>''')

def create_actor_page(nome,ator):
    f = open("archive/atores/"+ator['id']+".html","w")
    f.write(f'''<!DOCTYPE html>
<html>
    <head>
        <title>{nome}</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    </head>
    <body>
        <div class="w3-container" >
            <h2>{nome}</h2>
            <p><b>Filmes:</b></p>
            <ul class="w3-ul w3-hoverable">\n''')
    filmes_sorted = list(sorted(ator['filmes'], key=lambda x : x['title']))
    for e in filmes_sorted:
        f.write(f'''\t\t\t\t<li><a href="../filmes/{e['id']}.html">{e['title']}</a></li>\n''')
    f.write(f'''\t\t\t</ul>
            <a href="index.html" class="w3-button w3-teal w3-hover-gray w3-round-large">Voltar para a lista de atores</a>
        </div>
    </body>
</html>''')

def create_actor_index(atores):
    f = open("archive/atores/index.html","w")
    f.write('''<!DOCTYPE html>
<html>
    <head>
        <title>Lista de atores</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    </head>
    <body>
        <div class="w3-panel w3-teal" id="title">
            <h1 class="w3-opacity" style="text-align: center;"><b>Atores:</b></h1>
        </div>
        <div class="w3-container" >
            <ul class="w3-ul w3-hoverable">\n''')
    atores_sorted = dict(sorted(atores.items(), key= lambda x: x[0]))
    for key in atores_sorted:
        f.write(f'''\t\t\t\t<li><a href="{atores_sorted[key]['id']}.html">{key}</a></li>\n''')
    f.write(f'''\t\t\t</ul>
            <a href="#title" class="w3-button w3-teal w3-hover-gray w3-round-large">Voltar para o topo</a>
        </div>
    </body>
</html>''')

f = open("cinemaATP.json")

data = json.load(f)

filmes = {}
atores = {}
i=1
j=1
for e in data:
    fid = 'f'+str(i)
    filmes[fid] = e
    for a in e['cast']:
        if a not in atores:
            atores[a] = {}
            atores[a]['id'] = 'a'+str(j)
            atores[a]['filmes'] = []
            j +=1
        atores[a]['filmes'].append({'title': e['title'], 'id': fid})
    i+=1

for e in filmes:
    create_movie_page(e,filmes[e],atores)

create_movie_index(filmes)

for a in atores:
    create_actor_page(a, atores[a])

create_actor_index(atores)

f.close()
