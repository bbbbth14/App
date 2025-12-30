#ifndef STUDENT_H
#define STUDENT_H

#include <string>
#include <vector>
#include <map>
#include <iostream>
#include <iomanip>

using namespace std;

// Student class representing individual student records
class Student
{
private:
    string studentId;
    string name;
    int age;
    string email;
    string major;
    double gpa;
    map<string, double> courses; // courseName -> grade

public:
    // Constructors
    Student();
    Student(string id, string name, int age, string email, string major);

    // Getters
    string getStudentId() const { return studentId; }
    string getName() const { return name; }
    int getAge() const { return age; }
    string getEmail() const { return email; }
    string getMajor() const { return major; }
    double getGPA() const { return gpa; }
    const map<string, double> &getCourses() const { return courses; }

    // Setters
    void setName(const string &n) { name = n; }
    void setAge(int a) { age = a; }
    void setEmail(const string &e) { email = e; }
    void setMajor(const string &m) { major = m; }

    // Course management
    void addCourse(const string &courseName, double grade);
    void removeCourse(const string &courseName);
    void updateGrade(const string &courseName, double newGrade);
    bool hasCourse(const string &courseName) const;

    // GPA calculation
    void calculateGPA();

    // Display methods
    void displayInfo() const;
    void displayTranscript() const;

    // Serialization for file I/O
    string serialize() const;
    static Student deserialize(const string &data);

    // Comparison operators for sorting
    bool operator<(const Student &other) const
    {
        return gpa > other.gpa; // Sort by GPA descending
    }
};

#endif // STUDENT_H
