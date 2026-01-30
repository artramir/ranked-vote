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
        "candidate_name": "Claudia Vanessa Dobles Camargo",
        "color": "#FFD700",  # Gold
        "photo_url": "/images/candidates/ac.jpg",
        "flag_url": "/images/flags/ac.jpg",
        "description": "Coalición PAC y ADN - Arquitecta, ex primera dama"
    },
    {
        "name": "Alianza Costa Rica Primero",
        "abbreviation": "CR1",
        "candidate_name": "Douglas Caamaño Quirós",
        "color": "#0066CC",  # Blue
        "photo_url": "/images/candidates/cr1.jpg",
        "flag_url": "/images/flags/cr1.jpg",
        "description": "Empresario"
    },
    {
        "name": "Aquí Costa Rica Manda",
        "abbreviation": "ACRM",
        "candidate_name": "Ronny Castillo González",
        "color": "#00AA00",  # Green
        "photo_url": "/images/candidates/acrm.jpg",
        "flag_url": "/images/flags/acrm.jpg",
        "description": "Administrador de Empresas"
    },
    {
        "name": "Partido Avanza",
        "abbreviation": "PA",
        "candidate_name": "José Miguel Aguilar Berrocal",
        "color": "#FF6600",  # Orange
        "photo_url": "/images/candidates/pa.jpg",
        "flag_url": "/images/flags/pa.jpg",
        "description": "Psicólogo"
    },
    {
        "name": "Centro Democrático y Social",
        "abbreviation": "CDS",
        "candidate_name": "Ana Virginia Calzada Miranda",
        "color": "#4B0082",  # Indigo
        "photo_url": "/images/candidates/cds.jpg",
        "flag_url": "/images/flags/cds.jpg",
        "description": "Abogada, ex presidenta Sala Constitucional"
    },
    {
        "name": "De la Clase Trabajadora",
        "abbreviation": "PT",
        "candidate_name": "David Hernández Brenes",
        "color": "#DC143C",  # Crimson
        "photo_url": "/images/candidates/pt.jpg",
        "flag_url": "/images/flags/pt.jpg",
        "description": "Docente y sindicalista"
    },
    {
        "name": "Esperanza Nacional",
        "abbreviation": "PENAC",
        "candidate_name": "Claudio Alberto Alpízar Otoya",
        "color": "#32CD32",  # Lime Green
        "photo_url": "/images/candidates/penac.jpg",
        "flag_url": "/images/flags/penac.jpg",
        "description": "Politólogo"
    },
    {
        "name": "Esperanza y Libertad",
        "abbreviation": "PEL",
        "candidate_name": "Marco David Rodríguez Badilla",
        "color": "#20B2AA",  # Light Sea Green
        "photo_url": "/images/candidates/pel.jpg",
        "flag_url": "/images/flags/pel.jpg",
        "description": "Administrador Público"
    },
    {
        "name": "Frente Amplio",
        "abbreviation": "FA",
        "candidate_name": "Andrés Ariel Robles Barrantes",
        "color": "#FFEF00",  # Yellow
        "photo_url": "/images/candidates/fa.jpg",
        "flag_url": "/images/flags/fa.jpg",
        "description": "Docente, diputado - Izquierda democrática"
    },
    {
        "name": "Integración Nacional",
        "abbreviation": "PIN",
        "candidate_name": "Luis Esteban Amador Jiménez",
        "color": "#FF4500",  # Orange Red
        "photo_url": "/images/candidates/pin.jpg",
        "flag_url": "/images/flags/pin.jpg",
        "description": "Ingeniero Civil, ex ministro MOPT"
    },
    {
        "name": "Justicia Social Costarricense",
        "abbreviation": "PJSC",
        "candidate_name": "Walter Rubén Hernández Juárez",
        "color": "#8B4513",  # Brown
        "photo_url": "/images/candidates/pjsc.jpg",
        "flag_url": "/images/flags/pjsc.jpg",
        "description": "Abogado, ex viceministro"
    },
    {
        "name": "Partido Liberación Nacional",
        "abbreviation": "PLN",
        "candidate_name": "Álvaro Roberto Ramos Chaves",
        "color": "#008024",  # Green
        "photo_url": "/images/candidates/pln.jpg",
        "flag_url": "/images/flags/pln.jpg",
        "description": "Economista, ex presidente CCSS - Socialdemócrata"
    },
    {
        "name": "Partido Liberal Progresista",
        "abbreviation": "PLP",
        "candidate_name": "Eliécer Feinzaig Mintz",
        "color": "#00CED1",  # Dark Turquoise
        "photo_url": "/images/candidates/plp.jpg",
        "flag_url": "/images/flags/plp.jpg",
        "description": "Economista, diputado - Liberal"
    },
    {
        "name": "Nueva Generación",
        "abbreviation": "PNG",
        "candidate_name": "Fernando Dionisio Zamora Castellanos",
        "color": "#00BFFF",  # Deep Sky Blue
        "photo_url": "/images/candidates/png.jpg",
        "flag_url": "/images/flags/png.jpg",
        "description": "Abogado, ex secretario general PLN"
    },
    {
        "name": "Nueva República",
        "abbreviation": "PNR",
        "candidate_name": "Gerardo Fabricio Alvarado Muñoz",
        "color": "#1E90FF",  # Dodger Blue
        "photo_url": "/images/candidates/pnr.jpg",
        "flag_url": "/images/flags/pnr.jpg",
        "description": "Periodista, diputado - Conservador cristiano"
    },
    {
        "name": "Pueblo Soberano",
        "abbreviation": "PPSO",
        "candidate_name": "Laura Fernández Delgado",
        "color": "#029ba3",  # Teal
        "photo_url": "/images/candidates/ppso.jpg",
        "flag_url": "/images/flags/ppso.jpg",
        "description": "Politóloga, ex ministra - Oficialismo"
    },
    {
        "name": "Progreso Social Democrático",
        "abbreviation": "PPSD",
        "candidate_name": "Luz Mary Alpízar Loaiza",
        "color": "#9370DB",  # Medium Purple
        "photo_url": "/images/candidates/ppsd.jpg",
        "flag_url": "/images/flags/ppsd.jpg",
        "description": "Ingeniera Química, diputada"
    },
    {
        "name": "Unidad Social Cristiana",
        "abbreviation": "PUSC",
        "candidate_name": "Juan Carlos Hidalgo Bogantes",
        "color": "#0033A0",  # Blue
        "photo_url": "/images/candidates/pusc.jpg",
        "flag_url": "/images/flags/pusc.jpg",
        "description": "Internacionalista - Democracia cristiana"
    },
    {
        "name": "Unidos Podemos",
        "abbreviation": "UP",
        "candidate_name": "Natalia Díaz Quintana",
        "color": "#FF1493",  # Deep Pink
        "photo_url": "/images/candidates/up.jpg",
        "flag_url": "/images/flags/up.jpg",
        "description": "Administradora, ex ministra de la Presidencia"
    },
    {
        "name": "Unión Costarricense Democrática",
        "abbreviation": "PUCD",
        "candidate_name": "Boris Molina Acevedo",
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
