#include "Student.h"
#include <sstream>
#include <algorithm>
#include <stdexcept>

// Default constructor
Student::Student() : studentId(""), name(""), age(0), email(""), major(""), gpa(0.0) {}

// Parameterized constructor
Student::Student(string id, string name, int age, string email, string major)
    : studentId(id), name(name), age(age), email(email), major(major), gpa(0.0)
{

    if (age < 16 || age > 100)
    {
        throw invalid_argument("Invalid age: must be between 16 and 100");
    }
    if (id.empty() || name.empty())
    {
        throw invalid_argument("Student ID and name cannot be empty");
    }
}

// Add a course with grade
void Student::addCourse(const string &courseName, double grade)
{
    if (grade < 0.0 || grade > 4.0)
    {
        throw invalid_argument("Grade must be between 0.0 and 4.0");
    }
    courses[courseName] = grade;
    calculateGPA();
}

// Remove a course
void Student::removeCourse(const string &courseName)
{
    auto it = courses.find(courseName);
    if (it != courses.end())
    {
        courses.erase(it);
        calculateGPA();
    }
    else
    {
        throw runtime_error("Course not found: " + courseName);
    }
}

// Update course grade
void Student::updateGrade(const string &courseName, double newGrade)
{
    if (courses.find(courseName) == courses.end())
    {
        throw runtime_error("Course not found: " + courseName);
    }
    if (newGrade < 0.0 || newGrade > 4.0)
    {
        throw invalid_argument("Grade must be between 0.0 and 4.0");
    }
    courses[courseName] = newGrade;
    calculateGPA();
}

// Check if student has a course
bool Student::hasCourse(const string &courseName) const
{
    return courses.find(courseName) != courses.end();
}

// Calculate GPA based on all courses
void Student::calculateGPA()
{
    if (courses.empty())
    {
        gpa = 0.0;
        return;
    }

    double sum = 0.0;
    for (const auto &course : courses)
    {
        sum += course.second;
    }
    gpa = sum / courses.size();
}

// Display student information
void Student::displayInfo() const
{
    cout << "\n"
         << string(60, '=') << endl;
    cout << "STUDENT INFORMATION" << endl;
    cout << string(60, '=') << endl;
    cout << "ID:         " << studentId << endl;
    cout << "Name:       " << name << endl;
    cout << "Age:        " << age << endl;
    cout << "Email:      " << email << endl;
    cout << "Major:      " << major << endl;
    cout << "GPA:        " << fixed << setprecision(2) << gpa << endl;
    cout << "Courses:    " << courses.size() << " enrolled" << endl;
    cout << string(60, '=') << endl;
}

// Display full transcript
void Student::displayTranscript() const
{
    cout << "\n"
         << string(70, '=') << endl;
    cout << "TRANSCRIPT FOR: " << name << " (" << studentId << ")" << endl;
    cout << string(70, '=') << endl;
    cout << left << setw(40) << "Course Name" << right << setw(10) << "Grade" << endl;
    cout << string(70, '-') << endl;

    if (courses.empty())
    {
        cout << "No courses enrolled yet." << endl;
    }
    else
    {
        for (const auto &course : courses)
        {
            cout << left << setw(40) << course.first
                 << right << setw(10) << fixed << setprecision(2) << course.second << endl;
        }
    }

    cout << string(70, '-') << endl;
    cout << left << setw(40) << "CUMULATIVE GPA:"
         << right << setw(10) << fixed << setprecision(2) << gpa << endl;
    cout << string(70, '=') << endl;
}

// Serialize student data for file storage
string Student::serialize() const
{
    stringstream ss;
    ss << studentId << "|" << name << "|" << age << "|"
       << email << "|" << major << "|" << gpa << "|";

    // Serialize courses
    ss << courses.size() << "|";
    for (const auto &course : courses)
    {
        ss << course.first << ":" << course.second << "|";
    }

    return ss.str();
}

// Deserialize student data from file
Student Student::deserialize(const string &data)
{
    stringstream ss(data);
    string token;
    vector<string> tokens;

    while (getline(ss, token, '|'))
    {
        tokens.push_back(token);
    }

    if (tokens.size() < 7)
    {
        throw runtime_error("Invalid student data format");
    }

    Student student(tokens[0], tokens[1], stoi(tokens[2]), tokens[3], tokens[4]);
    student.gpa = stod(tokens[5]);

    int courseCount = stoi(tokens[6]);
    for (int i = 0; i < courseCount && (7 + i) < tokens.size(); i++)
    {
        size_t colonPos = tokens[7 + i].find(':');
        if (colonPos != string::npos)
        {
            string courseName = tokens[7 + i].substr(0, colonPos);
            double grade = stod(tokens[7 + i].substr(colonPos + 1));
            student.courses[courseName] = grade;
        }
    }

    return student;
}
