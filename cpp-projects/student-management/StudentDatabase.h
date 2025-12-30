#ifndef STUDENT_DATABASE_H
#define STUDENT_DATABASE_H

#include "Student.h"
#include <vector>
#include <memory>
#include <fstream>
#include <algorithm>

using namespace std;

// Database class to manage all students
class StudentDatabase
{
private:
    vector<shared_ptr<Student>> students;
    string filename;

    // Helper methods
    vector<shared_ptr<Student>>::iterator findStudentById(const string &id);

public:
    StudentDatabase(const string &dataFile = "students.dat");
    ~StudentDatabase();

    // CRUD operations
    void addStudent(shared_ptr<Student> student);
    bool removeStudent(const string &studentId);
    shared_ptr<Student> findStudent(const string &studentId);
    void updateStudent(const string &studentId, shared_ptr<Student> updatedStudent);

    // Query operations
    vector<shared_ptr<Student>> getAllStudents();
    vector<shared_ptr<Student>> findByName(const string &name);
    vector<shared_ptr<Student>> findByMajor(const string &major);
    vector<shared_ptr<Student>> getTopStudents(int count);

    // Statistics
    double getAverageGPA() const;
    int getTotalStudents() const { return students.size(); }
    int getStudentsByMajor(const string &major) const;

    // Sorting
    void sortByGPA();
    void sortByName();
    void sortById();

    // File operations
    bool saveToFile();
    bool loadFromFile();
    void exportToCSV(const string &csvFile);

    // Display
    void displayAllStudents() const;
    void displayStatistics() const;
};

#endif // STUDENT_DATABASE_H
