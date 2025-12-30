#include "StudentDatabase.h"
#include <iostream>
#include <iomanip>
#include <algorithm>

StudentDatabase::StudentDatabase(const string &dataFile) : filename(dataFile)
{
    loadFromFile();
}

StudentDatabase::~StudentDatabase()
{
    saveToFile();
}

// Find student by ID
vector<shared_ptr<Student>>::iterator StudentDatabase::findStudentById(const string &id)
{
    return find_if(students.begin(), students.end(),
                   [&id](const shared_ptr<Student> &s)
                   {
                       return s->getStudentId() == id;
                   });
}

// Add a new student
void StudentDatabase::addStudent(shared_ptr<Student> student)
{
    if (findStudentById(student->getStudentId()) != students.end())
    {
        throw runtime_error("Student ID already exists: " + student->getStudentId());
    }
    students.push_back(student);
    cout << "✓ Student added successfully!" << endl;
}

// Remove a student
bool StudentDatabase::removeStudent(const string &studentId)
{
    auto it = findStudentById(studentId);
    if (it != students.end())
    {
        students.erase(it);
        cout << "✓ Student removed successfully!" << endl;
        return true;
    }
    return false;
}

// Find a student by ID
shared_ptr<Student> StudentDatabase::findStudent(const string &studentId)
{
    auto it = findStudentById(studentId);
    if (it != students.end())
    {
        return *it;
    }
    return nullptr;
}

// Update student information
void StudentDatabase::updateStudent(const string &studentId, shared_ptr<Student> updatedStudent)
{
    auto it = findStudentById(studentId);
    if (it != students.end())
    {
        *it = updatedStudent;
        cout << "✓ Student updated successfully!" << endl;
    }
    else
    {
        throw runtime_error("Student not found: " + studentId);
    }
}

// Get all students
vector<shared_ptr<Student>> StudentDatabase::getAllStudents()
{
    return students;
}

// Find students by name (partial match)
vector<shared_ptr<Student>> StudentDatabase::findByName(const string &name)
{
    vector<shared_ptr<Student>> results;
    string lowerName = name;
    transform(lowerName.begin(), lowerName.end(), lowerName.begin(), ::tolower);

    for (const auto &student : students)
    {
        string studentName = student->getName();
        transform(studentName.begin(), studentName.end(), studentName.begin(), ::tolower);

        if (studentName.find(lowerName) != string::npos)
        {
            results.push_back(student);
        }
    }

    return results;
}

// Find students by major
vector<shared_ptr<Student>> StudentDatabase::findByMajor(const string &major)
{
    vector<shared_ptr<Student>> results;

    for (const auto &student : students)
    {
        if (student->getMajor() == major)
        {
            results.push_back(student);
        }
    }

    return results;
}

// Get top N students by GPA
vector<shared_ptr<Student>> StudentDatabase::getTopStudents(int count)
{
    vector<shared_ptr<Student>> sorted = students;
    sort(sorted.begin(), sorted.end(),
         [](const shared_ptr<Student> &a, const shared_ptr<Student> &b)
         {
             return a->getGPA() > b->getGPA();
         });

    if (count > sorted.size())
    {
        count = sorted.size();
    }

    return vector<shared_ptr<Student>>(sorted.begin(), sorted.begin() + count);
}

// Calculate average GPA
double StudentDatabase::getAverageGPA() const
{
    if (students.empty())
        return 0.0;

    double sum = 0.0;
    for (const auto &student : students)
    {
        sum += student->getGPA();
    }

    return sum / students.size();
}

// Get count of students by major
int StudentDatabase::getStudentsByMajor(const string &major) const
{
    return count_if(students.begin(), students.end(),
                    [&major](const shared_ptr<Student> &s)
                    {
                        return s->getMajor() == major;
                    });
}

// Sort by GPA
void StudentDatabase::sortByGPA()
{
    sort(students.begin(), students.end(),
         [](const shared_ptr<Student> &a, const shared_ptr<Student> &b)
         {
             return a->getGPA() > b->getGPA();
         });
}

// Sort by name
void StudentDatabase::sortByName()
{
    sort(students.begin(), students.end(),
         [](const shared_ptr<Student> &a, const shared_ptr<Student> &b)
         {
             return a->getName() < b->getName();
         });
}

// Sort by ID
void StudentDatabase::sortById()
{
    sort(students.begin(), students.end(),
         [](const shared_ptr<Student> &a, const shared_ptr<Student> &b)
         {
             return a->getStudentId() < b->getStudentId();
         });
}

// Save to file
bool StudentDatabase::saveToFile()
{
    ofstream file(filename);
    if (!file.is_open())
    {
        cerr << "Error: Cannot open file for writing: " << filename << endl;
        return false;
    }

    for (const auto &student : students)
    {
        file << student->serialize() << endl;
    }

    file.close();
    return true;
}

// Load from file
bool StudentDatabase::loadFromFile()
{
    ifstream file(filename);
    if (!file.is_open())
    {
        // File doesn't exist yet, not an error
        return true;
    }

    students.clear();
    string line;

    while (getline(file, line))
    {
        if (!line.empty())
        {
            try
            {
                auto student = make_shared<Student>(Student::deserialize(line));
                students.push_back(student);
            }
            catch (const exception &e)
            {
                cerr << "Error loading student: " << e.what() << endl;
            }
        }
    }

    file.close();
    return true;
}

// Export to CSV
void StudentDatabase::exportToCSV(const string &csvFile)
{
    ofstream file(csvFile);
    if (!file.is_open())
    {
        throw runtime_error("Cannot open CSV file for writing");
    }

    // Header
    file << "Student ID,Name,Age,Email,Major,GPA,Courses" << endl;

    // Data
    for (const auto &student : students)
    {
        file << student->getStudentId() << ","
             << student->getName() << ","
             << student->getAge() << ","
             << student->getEmail() << ","
             << student->getMajor() << ","
             << fixed << setprecision(2) << student->getGPA() << ","
             << student->getCourses().size() << endl;
    }

    file.close();
    cout << "✓ Data exported to " << csvFile << endl;
}

// Display all students
void StudentDatabase::displayAllStudents() const
{
    if (students.empty())
    {
        cout << "\nNo students in database." << endl;
        return;
    }

    cout << "\n"
         << string(100, '=') << endl;
    cout << "ALL STUDENTS (" << students.size() << " total)" << endl;
    cout << string(100, '=') << endl;

    cout << left << setw(12) << "ID"
         << setw(25) << "Name"
         << setw(6) << "Age"
         << setw(30) << "Email"
         << setw(18) << "Major"
         << right << setw(8) << "GPA" << endl;
    cout << string(100, '-') << endl;

    for (const auto &student : students)
    {
        cout << left << setw(12) << student->getStudentId()
             << setw(25) << student->getName()
             << setw(6) << student->getAge()
             << setw(30) << student->getEmail()
             << setw(18) << student->getMajor()
             << right << setw(8) << fixed << setprecision(2) << student->getGPA() << endl;
    }

    cout << string(100, '=') << endl;
}

// Display statistics
void StudentDatabase::displayStatistics() const
{
    cout << "\n"
         << string(60, '=') << endl;
    cout << "DATABASE STATISTICS" << endl;
    cout << string(60, '=') << endl;
    cout << "Total Students:     " << students.size() << endl;
    cout << "Average GPA:        " << fixed << setprecision(2) << getAverageGPA() << endl;

    // Count majors
    map<string, int> majorCounts;
    for (const auto &student : students)
    {
        majorCounts[student->getMajor()]++;
    }

    cout << "\nStudents by Major:" << endl;
    for (const auto &pair : majorCounts)
    {
        cout << "  " << left << setw(20) << pair.first << ": " << pair.second << endl;
    }

    cout << string(60, '=') << endl;
}
