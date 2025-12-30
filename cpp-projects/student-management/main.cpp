#include "Student.h"
#include "StudentDatabase.h"
#include <iostream>
#include <limits>
#include <memory>

using namespace std;

// Function prototypes
void displayMenu();
void addNewStudent(StudentDatabase &db);
void searchStudent(StudentDatabase &db);
void updateStudentInfo(StudentDatabase &db);
void deleteStudent(StudentDatabase &db);
void manageCourses(StudentDatabase &db);
void displayTopStudents(StudentDatabase &db);
void displayByMajor(StudentDatabase &db);
void clearScreen();
void pauseScreen();

int main()
{
    StudentDatabase db("students.dat");

    cout << "\n";
    cout << "╔═══════════════════════════════════════════════════════════╗" << endl;
    cout << "║                                                           ║" << endl;
    cout << "║          STUDENT MANAGEMENT SYSTEM v2.0                   ║" << endl;
    cout << "║          Advanced C++ Application                         ║" << endl;
    cout << "║                                                           ║" << endl;
    cout << "╚═══════════════════════════════════════════════════════════╝" << endl;

    int choice;

    while (true)
    {
        displayMenu();

        cout << "\nEnter your choice: ";
        cin >> choice;

        if (cin.fail())
        {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "❌ Invalid input! Please enter a number." << endl;
            pauseScreen();
            continue;
        }

        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        try
        {
            switch (choice)
            {
            case 1:
                addNewStudent(db);
                break;
            case 2:
                searchStudent(db);
                break;
            case 3:
                updateStudentInfo(db);
                break;
            case 4:
                deleteStudent(db);
                break;
            case 5:
                manageCourses(db);
                break;
            case 6:
                db.displayAllStudents();
                pauseScreen();
                break;
            case 7:
                displayTopStudents(db);
                break;
            case 8:
                displayByMajor(db);
                break;
            case 9:
                db.displayStatistics();
                pauseScreen();
                break;
            case 10:
                db.exportToCSV("students_export.csv");
                pauseScreen();
                break;
            case 0:
                cout << "\n👋 Thank you for using Student Management System!" << endl;
                cout << "💾 Data has been saved automatically." << endl;
                return 0;
            default:
                cout << "❌ Invalid choice! Please try again." << endl;
                pauseScreen();
            }
        }
        catch (const exception &e)
        {
            cout << "❌ Error: " << e.what() << endl;
            pauseScreen();
        }
    }

    return 0;
}

void displayMenu()
{
    clearScreen();
    cout << "\n╔═══════════════════════════════════════════════════════════╗" << endl;
    cout << "║                      MAIN MENU                            ║" << endl;
    cout << "╠═══════════════════════════════════════════════════════════╣" << endl;
    cout << "║  1. ➕ Add New Student                                    ║" << endl;
    cout << "║  2. 🔍 Search Student                                     ║" << endl;
    cout << "║  3. ✏️  Update Student Information                        ║" << endl;
    cout << "║  4. 🗑️  Delete Student                                    ║" << endl;
    cout << "║  5. 📚 Manage Courses & Grades                            ║" << endl;
    cout << "║  6. 📋 Display All Students                               ║" << endl;
    cout << "║  7. 🏆 Display Top Students                               ║" << endl;
    cout << "║  8. 🎓 Display Students by Major                          ║" << endl;
    cout << "║  9. 📊 Display Statistics                                 ║" << endl;
    cout << "║  10. 💾 Export to CSV                                     ║" << endl;
    cout << "║  0. 🚪 Exit                                               ║" << endl;
    cout << "╚═══════════════════════════════════════════════════════════╝" << endl;
}

void addNewStudent(StudentDatabase &db)
{
    string id, name, email, major;
    int age;

    cout << "\n"
         << string(60, '=') << endl;
    cout << "ADD NEW STUDENT" << endl;
    cout << string(60, '=') << endl;

    cout << "Enter Student ID: ";
    getline(cin, id);

    cout << "Enter Name: ";
    getline(cin, name);

    cout << "Enter Age: ";
    cin >> age;
    cin.ignore();

    cout << "Enter Email: ";
    getline(cin, email);

    cout << "Enter Major: ";
    getline(cin, major);

    auto student = make_shared<Student>(id, name, age, email, major);
    db.addStudent(student);

    pauseScreen();
}

void searchStudent(StudentDatabase &db)
{
    cout << "\n"
         << string(60, '=') << endl;
    cout << "SEARCH STUDENT" << endl;
    cout << string(60, '=') << endl;
    cout << "1. Search by ID" << endl;
    cout << "2. Search by Name" << endl;
    cout << "Enter choice: ";

    int choice;
    cin >> choice;
    cin.ignore();

    if (choice == 1)
    {
        string id;
        cout << "Enter Student ID: ";
        getline(cin, id);

        auto student = db.findStudent(id);
        if (student)
        {
            student->displayInfo();

            cout << "\nView transcript? (y/n): ";
            char viewTranscript;
            cin >> viewTranscript;
            cin.ignore();

            if (viewTranscript == 'y' || viewTranscript == 'Y')
            {
                student->displayTranscript();
            }
        }
        else
        {
            cout << "❌ Student not found!" << endl;
        }
    }
    else if (choice == 2)
    {
        string name;
        cout << "Enter Name (or part of it): ";
        getline(cin, name);

        auto results = db.findByName(name);
        if (results.empty())
        {
            cout << "❌ No students found!" << endl;
        }
        else
        {
            cout << "\n✓ Found " << results.size() << " student(s):" << endl;
            for (const auto &student : results)
            {
                cout << "\n"
                     << string(40, '-') << endl;
                student->displayInfo();
            }
        }
    }

    pauseScreen();
}

void updateStudentInfo(StudentDatabase &db)
{
    string id;
    cout << "\n"
         << string(60, '=') << endl;
    cout << "UPDATE STUDENT INFORMATION" << endl;
    cout << string(60, '=') << endl;
    cout << "Enter Student ID: ";
    getline(cin, id);

    auto student = db.findStudent(id);
    if (!student)
    {
        cout << "❌ Student not found!" << endl;
        pauseScreen();
        return;
    }

    student->displayInfo();

    cout << "\nWhat would you like to update?" << endl;
    cout << "1. Name" << endl;
    cout << "2. Age" << endl;
    cout << "3. Email" << endl;
    cout << "4. Major" << endl;
    cout << "Enter choice: ";

    int choice;
    cin >> choice;
    cin.ignore();

    switch (choice)
    {
    case 1:
    {
        string name;
        cout << "Enter new name: ";
        getline(cin, name);
        student->setName(name);
        break;
    }
    case 2:
    {
        int age;
        cout << "Enter new age: ";
        cin >> age;
        student->setAge(age);
        break;
    }
    case 3:
    {
        string email;
        cout << "Enter new email: ";
        getline(cin, email);
        student->setEmail(email);
        break;
    }
    case 4:
    {
        string major;
        cout << "Enter new major: ";
        getline(cin, major);
        student->setMajor(major);
        break;
    }
    default:
        cout << "❌ Invalid choice!" << endl;
        pauseScreen();
        return;
    }

    cout << "✓ Student information updated successfully!" << endl;
    pauseScreen();
}

void deleteStudent(StudentDatabase &db)
{
    string id;
    cout << "\n"
         << string(60, '=') << endl;
    cout << "DELETE STUDENT" << endl;
    cout << string(60, '=') << endl;
    cout << "Enter Student ID: ";
    getline(cin, id);

    auto student = db.findStudent(id);
    if (!student)
    {
        cout << "❌ Student not found!" << endl;
        pauseScreen();
        return;
    }

    student->displayInfo();

    cout << "\n⚠️  Are you sure you want to delete this student? (y/n): ";
    char confirm;
    cin >> confirm;
    cin.ignore();

    if (confirm == 'y' || confirm == 'Y')
    {
        db.removeStudent(id);
    }
    else
    {
        cout << "❌ Deletion cancelled." << endl;
    }

    pauseScreen();
}

void manageCourses(StudentDatabase &db)
{
    string id;
    cout << "\n"
         << string(60, '=') << endl;
    cout << "MANAGE COURSES & GRADES" << endl;
    cout << string(60, '=') << endl;
    cout << "Enter Student ID: ";
    getline(cin, id);

    auto student = db.findStudent(id);
    if (!student)
    {
        cout << "❌ Student not found!" << endl;
        pauseScreen();
        return;
    }

    student->displayTranscript();

    cout << "\n1. Add Course" << endl;
    cout << "2. Update Grade" << endl;
    cout << "3. Remove Course" << endl;
    cout << "Enter choice: ";

    int choice;
    cin >> choice;
    cin.ignore();

    string courseName;
    double grade;

    switch (choice)
    {
    case 1:
        cout << "Enter Course Name: ";
        getline(cin, courseName);
        cout << "Enter Grade (0.0-4.0): ";
        cin >> grade;
        student->addCourse(courseName, grade);
        cout << "✓ Course added successfully!" << endl;
        break;

    case 2:
        cout << "Enter Course Name: ";
        getline(cin, courseName);
        cout << "Enter New Grade (0.0-4.0): ";
        cin >> grade;
        student->updateGrade(courseName, grade);
        cout << "✓ Grade updated successfully!" << endl;
        break;

    case 3:
        cout << "Enter Course Name: ";
        getline(cin, courseName);
        student->removeCourse(courseName);
        cout << "✓ Course removed successfully!" << endl;
        break;

    default:
        cout << "❌ Invalid choice!" << endl;
    }

    cout << "\nUpdated GPA: " << fixed << setprecision(2) << student->getGPA() << endl;
    pauseScreen();
}

void displayTopStudents(StudentDatabase &db)
{
    int count;
    cout << "\n"
         << string(60, '=') << endl;
    cout << "TOP STUDENTS BY GPA" << endl;
    cout << string(60, '=') << endl;
    cout << "How many top students to display? ";
    cin >> count;
    cin.ignore();

    auto topStudents = db.getTopStudents(count);

    cout << "\n🏆 TOP " << topStudents.size() << " STUDENTS" << endl;
    cout << string(60, '-') << endl;

    int rank = 1;
    for (const auto &student : topStudents)
    {
        cout << "\n#" << rank++ << " - " << student->getName()
             << " (GPA: " << fixed << setprecision(2) << student->getGPA() << ")" << endl;
        cout << "    ID: " << student->getStudentId() << ", Major: " << student->getMajor() << endl;
    }

    pauseScreen();
}

void displayByMajor(StudentDatabase &db)
{
    string major;
    cout << "\n"
         << string(60, '=') << endl;
    cout << "STUDENTS BY MAJOR" << endl;
    cout << string(60, '=') << endl;
    cout << "Enter Major: ";
    getline(cin, major);

    auto students = db.findByMajor(major);

    if (students.empty())
    {
        cout << "❌ No students found in " << major << endl;
    }
    else
    {
        cout << "\n✓ Found " << students.size() << " student(s) in " << major << ":" << endl;
        for (const auto &student : students)
        {
            cout << "  • " << student->getName() << " (" << student->getStudentId()
                 << ") - GPA: " << fixed << setprecision(2) << student->getGPA() << endl;
        }
    }

    pauseScreen();
}

void clearScreen()
{
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

void pauseScreen()
{
    cout << "\nPress Enter to continue...";
    cin.get();
}
