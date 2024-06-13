from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

Base = declarative_base()
engine = create_engine('sqlite:///hospital.db')
Session = sessionmaker(bind=engine)
session = Session()

class Patient(Base):
    __tablename__ = 'patients'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    address = Column(String)
    phone = Column(String)

class Doctor(Base):
    __tablename__ = 'doctors'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    phone = Column(String)

class Appointment(Base):
    __tablename__ = 'appointments'
    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    doctor_id = Column(Integer, ForeignKey('doctors.id'))
    appointment_date = Column(DateTime, nullable=False)
    reason = Column(String)

    patient = relationship('Patient')
    doctor = relationship('Doctor')

Base.metadata.create_all(engine)

def exit_program():
    print("Exiting the program...")
    exit()

def add_doctor():
    name = input("Enter doctor's name: ")
    specialty = input("Enter doctor's specialty: ")
    phone = input("Enter doctor's phone: ")
    doctor = Doctor(name=name, specialization=specialty, phone=phone)
    session.add(doctor)
    session.commit()
    print(f"Doctor {name} added.")

def add_patient():
    name = input("Enter patient's name: ")
    age = int(input("Enter patient's age: "))
    gender = input("Enter patient's gender: ")
    address = input("Enter patient's address: ")
    phone = input("Enter patient's phone: ")
    patient = Patient(name=name, age=age, gender=gender, address=address, phone=phone)
    session.add(patient)
    session.commit()
    print(f"Patient {name} added.")

def add_appointment():
    patient_id = int(input("Enter patient ID: "))
    doctor_id = int(input("Enter doctor ID: "))
    appointment_date = datetime.strptime(input("Enter appointment date (YYYY-MM-DD HH:MM): "), "%Y-%m-%d %H:%M")
    reason = input("Enter appointment reason: ")
    appointment = Appointment(patient_id=patient_id, doctor_id=doctor_id, appointment_date=appointment_date, reason=reason)
    session.add(appointment)
    session.commit()
    print("Appointment added.")

def list_doctors():
    doctors = session.query(Doctor).all()
    for doctor in doctors:
        print(f"{doctor.id}: {doctor.name} - {doctor.specialization}")

def list_patients():
    patients = session.query(Patient).all()
    for patient in patients:
        print(f"{patient.id}: {patient.name} - {patient.age} - {patient.gender}")

def list_appointments():
    appointments = session.query(Appointment).all()
    for appointment in appointments:
        print(f"{appointment.id}: Patient {appointment.patient_id}, Doctor {appointment.doctor_id} on {appointment.appointment_date} - {appointment.reason}")

def find_doctor():
    doctor_id = int(input("Enter doctor ID: "))
    doctor = session.query(Doctor).filter_by(id=doctor_id).first()
    if doctor:
        print(f"{doctor.id}: {doctor.name} - {doctor.specialization}")
    else:
        print("Doctor not found.")

def find_patient():
    patient_id = int(input("Enter patient ID: "))
    patient = session.query(Patient).filter_by(id=patient_id).first()
    if patient:
        print(f"{patient.id}: {patient.name} - {patient.age} - {patient.gender}")
    else:
        print("Patient not found.")

def find_appointment():
    appointment_id = int(input("Enter appointment ID: "))
    appointment = session.query(Appointment).filter_by(id=appointment_id).first()
    if appointment:
        print(f"{appointment.id}: Patient {appointment.patient_id}, Doctor {appointment.doctor_id} on {appointment.appointment_date} - {appointment.reason}")
    else:
        print("Appointment not found.")
