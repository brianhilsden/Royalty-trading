from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
import click
from datetime import datetime
import sqlite3
Base = declarative_base()

class Patient(Base):
    __tablename__ = 'patients'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    address = Column(String)
    phone = Column(String)

    def __init__(self, name, age, gender, address, phone):
        self.name = name
        self.age = age
        self.gender = gender
        self.address = address
        self.phone = phone
    
    def __repr__(self):
        return '<Patient %r>' % self.name

class Doctor(Base):
    __tablename__ = 'doctors'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    phone = Column(String)

    def __init__(self, name, specialization, phone):
        self.name = name
        self.specialization = specialization
        self.phone = phone
    
    def __repr__(self):
        return '<Doctor %r>' % self.name

class Appointment(Base):
    __tablename__ = 'appointments'
    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    doctor_id = Column(Integer, ForeignKey('doctors.id'))
    appointment_date = Column(DateTime, nullable=False)
    reason = Column(String)

    patient = relationship('Patient')
    doctor = relationship('Doctor')

    def __init__(self, patient_id, doctor_id, appointment_date, reason):
        self.patient_id = patient_id
        self.doctor_id = doctor_id
        self.appointment_date = appointment_date
        self.reason = reason
    
    def __repr__(self):
        return '<Appointment %r>' % self.id

engine = create_engine('sqlite:///hospital.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

def create_doctor(name, specialty, phone):
    doctor = Doctor(name=name, specialization=specialty, phone=phone)
    session.add(doctor)
    session.commit()
    return doctor

def create_patient(name, age, gender, address, phone):
    patient = Patient(name=name, age=age, gender=gender, address=address, phone=phone)
    session.add(patient)
    session.commit()
    return patient

def create_appointment(patient_id, doctor_id, appointment_date, reason):
    appointment = Appointment(patient_id=patient_id, doctor_id=doctor_id, appointment_date=appointment_date, reason=reason)
    session.add(appointment)
    session.commit()
    return appointment

def delete_doctor(doctor_id):
    doctor = session.query(Doctor).filter_by(id=doctor_id).first()
    session.delete(doctor)
    session.commit()

def delete_patient(patient_id):
    patient = session.query(Patient).filter_by(id=patient_id).first()
    session.delete(patient)
    session.commit()

def delete_appointment(appointment_id):
    appointment = session.query(Appointment).filter_by(id=appointment_id).first()
    session.delete(appointment)
    session.commit()

def get_all_doctors():
    return session.query(Doctor).all()

def get_all_patients():
    return session.query(Patient).all()

def get_all_appointments():
    return session.query(Appointment).all()

def find_doctor_by_id(doctor_id):
    return session.query(Doctor).filter_by(id=doctor_id).first()

def find_patient_by_id(patient_id):
    return session.query(Patient).filter_by(id=patient_id).first()

def find_appointment_by_id(appointment_id):
    return session.query(Appointment).filter_by(id=appointment_id).first()

def find_doctor_by_name(name):
    return session.query(Doctor).filter_by(name=name).first()

def find_patient_by_name(name):
    return session.query(Patient).filter_by(name=name).first()

@click.group()
def cli():
    pass

@click.command()
@click.option('--name', prompt='Doctor name', help='The name of the doctor.')
@click.option('--specialty', prompt='Doctor specialty', help='The specialty of the doctor.')
@click.option('--phone', prompt='Doctor phone', help='The phone of the doctor.')
def add_doctor(name, specialty, phone):
    create_doctor(name, specialty, phone)
    click.echo(f'Doctor {name} added.')

@click.command()
@click.option('--name', prompt='Patient name', help='The name of the patient.')
@click.option('--age', prompt='Patient age', help='The age of the patient.')
@click.option('--gender', prompt='Patient gender', help='The gender of the patient.')
@click.option('--address', prompt='Patient address', help='The address of the patient.')
@click.option('--phone', prompt='Patient phone', help='The phone of the patient.')
def add_patient(name, age, gender, address, phone):
    create_patient(name, age, gender, address, phone)
    click.echo(f'Patient {name} added.')

@click.command()
@click.option('--id', prompt='Doctor ID', help='The ID of the doctor to delete.')
def remove_doctor(id):
    delete_doctor(id)
    click.echo(f'Doctor with ID {id} deleted.')

@click.command()
@click.option('--id', prompt='Patient ID', help='The ID of the patient to delete.')
def remove_patient(id):
    delete_patient(id)
    click.echo(f'Patient with ID {id} deleted.')

@click.command()
def list_doctors():
    doctors = get_all_doctors()
    for doctor in doctors:
        click.echo(f'{doctor.id}: {doctor.name} - {doctor.specialization}')

@click.command()
def list_patients():
    patients = get_all_patients()
    for patient in patients:
        click.echo(f'{patient.id}: {patient.name} - {patient.age}')

@click.command()
@click.option('--id', prompt='Doctor ID', help='The ID of the doctor to find.')
def find_doctor(id):
    doctor = find_doctor_by_id(id)
    if doctor:
        click.echo(f'{doctor.id}: {doctor.name} - {doctor.specialization}')
    else:
        click.echo('Doctor not found.')

@click.command()
@click.option('--id', prompt='Patient ID', help='The ID of the patient to find.')
def find_patient(id):
    patient = find_patient_by_id(id)
    if patient:
        click.echo(f'{patient.id}: {patient.name} - {patient.age}')
    else:
        click.echo('Patient not found.')

cli.add_command(add_doctor)
cli.add_command(add_patient)
cli.add_command(remove_doctor)
cli.add_command(remove_patient)
cli.add_command(list_doctors)
cli.add_command(list_patients)
cli.add_command(find_doctor)
cli.add_command(find_patient)

if __name__ == '__main__':
    cli()

# Connect to the SQLite database
connection = sqlite3.connect('hospital.db')

# Create a cursor object
cursor = connection.cursor()

# Execute a query to get the list of tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")

# Fetch all results from the executed query
tables = cursor.fetchall()

# Print the list of tables
for table in tables:
    print(table[0])

# Close the connection
connection.close()
