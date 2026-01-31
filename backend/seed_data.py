"""
Seed data for Costa Rica 2026 Presidential Election
20 political parties with their candidates

Note: This data should be updated with actual candidates once confirmed
"""

# List of 20 parties competing in Costa Rica 2026 election
# Data extracted from Wikipedia: https://es.wikipedia.org/wiki/Elecciones_generales_de_Costa_Rica_de_2026
PARTIES_DATA = [
    {
        "name": "Coalición Agenda Ciudadana",
        "abbreviation": "AC",
        "first_firstname": "Claudia",
        "second_firstname": "Vanessa",
        "display_firstname": "Claudia",
        "first_lastname": "Dobles",
        "second_lastname": "Camargo",
        "color": "#FFD700",  # Gold
        "photo_url": "/images/candidates/ac.jpg",
        "flag_url": "/images/flags/ac.jpg",
        "description": "Coalición PAC y ADN - Arquitecta, ex primera dama"
    },
    {
        "name": "Alianza Costa Rica Primero",
        "abbreviation": "CR1",
        "first_firstname": "Douglas",
        "second_firstname": "",
        "display_firstname": "Douglas",
        "first_lastname": "Caamaño",
        "second_lastname": "Quirós",
        "color": "#0066CC",  # Blue
        "photo_url": "/images/candidates/cr1.jpg",
        "flag_url": "/images/flags/cr1.jpg",
        "description": "Empresario"
    },
    {
        "name": "Aquí Costa Rica Manda",
        "abbreviation": "ACRM",
        "first_firstname": "Ronny",
        "second_firstname": "",
        "display_firstname": "Ronny",
        "first_lastname": "Castillo",
        "second_lastname": "González",
        "color": "#00AA00",  # Green
        "photo_url": "/images/candidates/acrm.jpg",
        "flag_url": "/images/flags/acrm.jpg",
        "description": "Administrador de Empresas"
    },
    {
        "name": "Avanza",
        "abbreviation": "PA",
        "first_firstname": "José",
        "second_firstname": "Miguel",
        "display_firstname": "José Miguel",
        "first_lastname": "Aguilar",
        "second_lastname": "Berrocal",
        "color": "#FF6600",  # Orange
        "photo_url": "/images/candidates/pa.jpg",
        "flag_url": "/images/flags/pa.jpg",
        "description": "Psicólogo"
    },
    {
        "name": "Centro Democrático y Social",
        "abbreviation": "CDS",
        "first_firstname": "Ana",
        "second_firstname": "Virginia",
        "display_firstname": "Ana Virginia",
        "first_lastname": "Calzada",
        "second_lastname": "Miranda",
        "color": "#4B0082",  # Indigo
        "photo_url": "/images/candidates/cds.jpg",
        "flag_url": "/images/flags/cds.jpg",
        "description": "Abogada, ex presidenta Sala Constitucional"
    },
    {
        "name": "De la Clase Trabajadora",
        "abbreviation": "PT",
        "first_firstname": "David",
        "second_firstname": "",
        "display_firstname": "David",
        "first_lastname": "Hernández",
        "second_lastname": "Brenes",
        "color": "#DC143C",  # Crimson
        "photo_url": "/images/candidates/pt.jpg",
        "flag_url": "/images/flags/pt.jpg",
        "description": "Docente y sindicalista"
    },
    {
        "name": "Esperanza Nacional",
        "abbreviation": "PENAC",
        "first_firstname": "Claudio",
        "second_firstname": "Alberto",
        "display_firstname": "Claudio",
        "first_lastname": "Alpízar",
        "second_lastname": "Otoya",
        "color": "#32CD32",  # Lime Green
        "photo_url": "/images/candidates/penac.jpg",
        "flag_url": "/images/flags/penac.jpg",
        "description": "Politólogo"
    },
    {
        "name": "Esperanza y Libertad",
        "abbreviation": "PEL",
        "first_firstname": "Marco",
        "second_firstname": "David",
        "display_firstname": "Marco",
        "first_lastname": "Rodríguez",
        "second_lastname": "Badilla",
        "color": "#20B2AA",  # Light Sea Green
        "photo_url": "/images/candidates/pel.jpg",
        "flag_url": "/images/flags/pel.jpg",
        "description": "Administrador Público"
    },
    {
        "name": "Frente Amplio",
        "abbreviation": "FA",
        "first_firstname": "Andrés",
        "second_firstname": "Ariel",
        "display_firstname": "Ariel",
        "first_lastname": "Robles",
        "second_lastname": "Barrantes",
        "color": "#FFEF00",  # Yellow
        "photo_url": "/images/candidates/fa.jpg",
        "flag_url": "/images/flags/fa.jpg",
        "description": "Docente, diputado - Izquierda democrática"
    },
    {
        "name": "Integración Nacional",
        "abbreviation": "PIN",
        "first_firstname": "Luis",
        "second_firstname": "Esteban",
        "display_firstname": "Luis",
        "first_lastname": "Amador",
        "second_lastname": "Jiménez",
        "color": "#FF4500",  # Orange Red
        "photo_url": "/images/candidates/pin.jpg",
        "flag_url": "/images/flags/pin.jpg",
        "description": "Ingeniero Civil, ex ministro MOPT"
    },
    {
        "name": "Justicia Social Costarricense",
        "abbreviation": "PJSC",
        "first_firstname": "Walter",
        "second_firstname": "Rubén",
        "display_firstname": "Walter",
        "first_lastname": "Hernández",
        "second_lastname": "Juárez",
        "color": "#8B4513",  # Brown
        "photo_url": "/images/candidates/pjsc.jpg",
        "flag_url": "/images/flags/pjsc.jpg",
        "description": "Abogado, ex viceministro"
    },
    {
        "name": "Liberación Nacional",
        "abbreviation": "PLN",
        "first_firstname": "Álvaro",
        "second_firstname": "Roberto",
        "display_firstname": "Álvaro",
        "first_lastname": "Ramos",
        "second_lastname": "Chaves",
        "color": "#008024",  # Green
        "photo_url": "/images/candidates/pln.jpg",
        "flag_url": "/images/flags/pln.jpg",
        "description": "Economista, ex presidente CCSS - Socialdemócrata"
    },
    {
        "name": "Liberal Progresista",
        "abbreviation": "PLP",
        "first_firstname": "Eliécer",
        "second_firstname": "",
        "display_firstname": "Eliécer",
        "first_lastname": "Feinzaig",
        "second_lastname": "Mintz",
        "color": "#00CED1",  # Dark Turquoise
        "photo_url": "/images/candidates/plp.jpg",
        "flag_url": "/images/flags/plp.jpg",
        "description": "Economista, diputado - Liberal"
    },
    {
        "name": "Nueva Generación",
        "abbreviation": "PNG",
        "first_firstname": "Fernando",
        "second_firstname": "Dionisio",
        "display_firstname": "Fernando",
        "first_lastname": "Zamora",
        "second_lastname": "Castellanos",
        "color": "#00BFFF",  # Deep Sky Blue
        "photo_url": "/images/candidates/png.jpg",
        "flag_url": "/images/flags/png.jpg",
        "description": "Abogado, ex secretario general PLN"
    },
    {
        "name": "Nueva República",
        "abbreviation": "PNR",
        "first_firstname": "Gerardo",
        "second_firstname": "Fabricio",
        "display_firstname": "Fabricio",
        "first_lastname": "Alvarado",
        "second_lastname": "Muñoz",
        "color": "#1E90FF",  # Dodger Blue
        "photo_url": "/images/candidates/pnr.jpg",
        "flag_url": "/images/flags/pnr.jpg",
        "description": "Periodista, diputado - Conservador cristiano"
    },
    {
        "name": "Pueblo Soberano",
        "abbreviation": "PPSO",
        "first_firstname": "Laura",
        "second_firstname": "",
        "display_firstname": "Laura",
        "first_lastname": "Fernández",
        "second_lastname": "Delgado",
        "color": "#029ba3",  # Teal
        "photo_url": "/images/candidates/ppso.jpg",
        "flag_url": "/images/flags/ppso.jpg",
        "description": "Politóloga, ex ministra - Oficialismo"
    },
    {
        "name": "Progreso Social Democrático",
        "abbreviation": "PPSD",
        "first_firstname": "Luz",
        "second_firstname": "Mary",
        "display_firstname": "Luz Mary",
        "first_lastname": "Alpízar",
        "second_lastname": "Loaiza",
        "color": "#9370DB",  # Medium Purple
        "photo_url": "/images/candidates/ppsd.jpg",
        "flag_url": "/images/flags/ppsd.jpg",
        "description": "Ingeniera Química, diputada"
    },
    {
        "name": "Unidad Social Cristiana",
        "abbreviation": "PUSC",
        "first_firstname": "Juan",
        "second_firstname": "Carlos",
        "display_firstname": "Juan Carlos",
        "first_lastname": "Hidalgo",
        "second_lastname": "Bogantes",
        "color": "#0033A0",  # Blue
        "photo_url": "/images/candidates/pusc.jpg",
        "flag_url": "/images/flags/pusc.jpg",
        "description": "Internacionalista - Democracia cristiana"
    },
    {
        "name": "Unidos Podemos",
        "abbreviation": "UP",
        "first_firstname": "Natalia",
        "second_firstname": "",
        "display_firstname": "Natalia",
        "first_lastname": "Díaz",
        "second_lastname": "Quintana",
        "color": "#FF1493",  # Deep Pink
        "photo_url": "/images/candidates/up.jpg",
        "flag_url": "/images/flags/up.jpg",
        "description": "Administradora, ex ministra de la Presidencia"
    },
    {
        "name": "Unión Costarricense Democrática",
        "abbreviation": "PUCD",
        "first_firstname": "Boris",
        "second_firstname": "",
        "display_firstname": "Boris",
        "first_lastname": "Molina",
        "second_lastname": "Acevedo",
        "color": "#B8860B",  # Dark Goldenrod
        "photo_url": "/images/candidates/pucd.jpg",
        "flag_url": "/images/flags/pucd.jpg",
        "description": "Abogado"
    },
]


def get_parties_data():
    """Returns the list of all parties"""
    return PARTIES_DATA


def seed_database(db_session):
    """
    Populate database with initial party data
    
    Args:
        db_session: SQLAlchemy database session
    """
    from models import Party
    
    # Check if parties already exist
    existing_count = db_session.query(Party).count()
    if existing_count > 0:
        print(f"⚠️  Database already has {existing_count} parties. Skipping seed.")
        return
    
    # Insert all parties
    for party_data in PARTIES_DATA:
        party = Party(**party_data)
        db_session.add(party)
    
    db_session.commit()
    print(f"✅ Seeded database with {len(PARTIES_DATA)} parties")


if __name__ == "__main__":
    # Allow running this script directly to seed the database
    from database import get_db_session, init_db
    
    init_db()
    session = get_db_session()
    try:
        seed_database(session)
    finally:
        session.close()
