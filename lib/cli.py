from helpers import (
    exit_program,
    add_doctor,
    add_patient,
    add_appointment,
    list_doctors,
    list_patients,
    list_appointments,
    find_doctor,
    find_patient,
    find_appointment
)

def main():
    while True:
        menu()
        choice = input("> ")
        if choice == "0":
            exit_program()
        elif choice == "1":
            add_doctor()
        elif choice == "2":
            add_patient()
        elif choice == "3":
            add_appointment()
        elif choice == "4":
            list_doctors()
        elif choice == "5":
            list_patients()
        elif choice == "6":
            list_appointments()
        elif choice == "7":
            find_doctor()
        elif choice == "8":
            find_patient()
        elif choice == "9":
            find_appointment()
        else:
            print("Invalid choice")

def menu():
    print("Please select an option:")
    print("0. Exit the program")
    print("1. Add Doctor")
    print("2. Add Patient")
    print("3. Add Appointment")
    print("4. List Doctors")
    print("5. List Patients")
    print("6. List Appointments")
    print("7. Find Doctor")
    print("8. Find Patient")
    print("9. Find Appointment")

if __name__ == "__main__":
    main()
