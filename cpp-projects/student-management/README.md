# 🎓 Student Management System - Advanced C++ Application

A comprehensive, production-ready student management system demonstrating advanced C++ concepts including OOP, STL, file I/O, smart pointers, exception handling, and more.

## 🌟 Features

### Core Functionality

- ✅ **CRUD Operations**: Create, Read, Update, Delete students
- 📚 **Course Management**: Add/remove courses, update grades, calculate GPA
- 🔍 **Advanced Search**: Search by ID, name, or major
- 📊 **Statistics**: Database statistics, average GPA, major distribution
- 🏆 **Rankings**: Display top students by GPA
- 💾 **Data Persistence**: Automatic save/load with custom file format
- 📤 **Export**: Export data to CSV format

### Technical Highlights

- **Object-Oriented Design**: Multiple classes with proper encapsulation
- **Smart Pointers**: Uses `shared_ptr` for automatic memory management
- **STL Containers**: `vector`, `map` for efficient data structures
- **Lambda Functions**: Modern C++ for sorting and filtering
- **Exception Handling**: Robust error handling with try-catch
- **File I/O**: Custom serialization/deserialization
- **Const Correctness**: Proper use of const methods
- **Operator Overloading**: Custom comparison operators
- **Templates**: Generic programming patterns

## 🏗️ Architecture

```
student-management/
├── Student.h              # Student class declaration
├── Student.cpp            # Student class implementation
├── StudentDatabase.h      # Database manager declaration
├── StudentDatabase.cpp    # Database manager implementation
├── main.cpp               # Main program with UI
├── Makefile               # Build configuration
└── README.md             # This file
```

### Class Structure

```cpp
Student
├── Private: studentId, name, age, email, major, gpa, courses
├── Public Methods:
│   ├── Getters/Setters
│   ├── addCourse(), removeCourse(), updateGrade()
│   ├── calculateGPA()
│   ├── displayInfo(), displayTranscript()
│   └── serialize(), deserialize()

StudentDatabase
├── Private: vector<shared_ptr<Student>>, filename
├── Public Methods:
│   ├── addStudent(), removeStudent(), findStudent()
│   ├── getAllStudents(), findByName(), findByMajor()
│   ├── getTopStudents(), getAverageGPA()
│   ├── sortByGPA(), sortByName(), sortById()
│   ├── saveToFile(), loadFromFile()
│   └── exportToCSV(), displayStatistics()
```

## 🚀 Compilation & Running

### Using Makefile (Linux/Mac)

```bash
# Compile
make

# Run
make run

# Clean
make clean

# Build and run
make build-run
```

### Using g++ directly

```bash
# Compile
g++ -std=c++17 -Wall -Wextra -O2 main.cpp Student.cpp StudentDatabase.cpp -o student_management

# Run
./student_management
```

### Windows (PowerShell)

```powershell
# Compile
g++ -std=c++17 -Wall -Wextra -O2 main.cpp Student.cpp StudentDatabase.cpp -o student_management.exe

# Run
.\student_management.exe
```

## 📖 Usage Examples

### Adding a Student

```
1. Select "Add New Student" from menu
2. Enter Student ID: ST001
3. Enter Name: John Doe
4. Enter Age: 20
5. Enter Email: john.doe@university.edu
6. Enter Major: Computer Science
```

### Managing Courses

```
1. Select "Manage Courses & Grades"
2. Enter Student ID: ST001
3. Choose "Add Course"
4. Enter Course Name: Data Structures
5. Enter Grade: 3.8
```

### Searching Students

```
1. Select "Search Student"
2. Choose "Search by Name"
3. Enter: John
4. System displays all matching students
```

## 💡 Advanced C++ Concepts Demonstrated

### 1. Smart Pointers

```cpp
shared_ptr<Student> student = make_shared<Student>(id, name, age, email, major);
db.addStudent(student);
```

### 2. Lambda Functions

```cpp
sort(students.begin(), students.end(),
    [](const shared_ptr<Student>& a, const shared_ptr<Student>& b) {
        return a->getGPA() > b->getGPA();
    });
```

### 3. STL Algorithms

```cpp
auto it = find_if(students.begin(), students.end(),
    [&id](const shared_ptr<Student>& s) {
        return s->getStudentId() == id;
    });
```

### 4. Exception Handling

```cpp
try {
    student->addCourse(courseName, grade);
} catch (const invalid_argument& e) {
    cerr << "Error: " << e.what() << endl;
}
```

### 5. Operator Overloading

```cpp
bool operator<(const Student& other) const {
    return gpa > other.gpa;
}
```

### 6. File Serialization

```cpp
string Student::serialize() const {
    stringstream ss;
    ss << studentId << "|" << name << "|" << age << "|"
       << email << "|" << major << "|" << gpa;
    return ss.str();
}
```

## 📊 Data Format

### File Storage (students.dat)

```
ST001|John Doe|20|john@university.edu|CS|3.75|2|DataStructures:3.8|Algorithms:3.7|
ST002|Jane Smith|21|jane@university.edu|Math|3.90|3|Calculus:4.0|Algebra:3.9|Stats:3.8|
```

### CSV Export (students_export.csv)

```csv
Student ID,Name,Age,Email,Major,GPA,Courses
ST001,John Doe,20,john@university.edu,CS,3.75,2
ST002,Jane Smith,21,jane@university.edu,Math,3.90,3
```

## 🎯 Learning Objectives

This project helps you master:

1. **OOP Principles**: Encapsulation, inheritance concepts
2. **Memory Management**: Smart pointers, RAII pattern
3. **STL Mastery**: Containers (vector, map), algorithms
4. **Modern C++**: C++11/14/17 features (auto, lambda, smart pointers)
5. **File I/O**: Text file operations, serialization
6. **Error Handling**: Exceptions, input validation
7. **Code Organization**: Multiple files, header/implementation separation
8. **User Interface**: Menu-driven console application
9. **Data Structures**: Efficient searching, sorting
10. **Software Design**: Class relationships, modularity

## 🔧 Customization Ideas

1. **Add Authentication**: User login system with roles
2. **Database Integration**: Replace file I/O with SQLite
3. **GUI Interface**: Use Qt or wxWidgets
4. **Network Features**: Client-server architecture
5. **Advanced Analytics**: Graphs, predictive modeling
6. **Attendance Tracking**: Track student attendance
7. **Fee Management**: Tuition and payment tracking
8. **Course Prerequisites**: Enforce course requirements
9. **Grade Calculation**: Support different grading scales
10. **Report Generation**: PDF reports using libraries

## 📝 Requirements

- **Compiler**: g++ with C++17 support
- **OS**: Windows, Linux, or macOS
- **RAM**: 100MB minimum
- **Disk**: 10MB for application + storage

## 🐛 Error Handling

The system handles:

- Invalid student ages (< 16 or > 100)
- Invalid grades (< 0.0 or > 4.0)
- Duplicate student IDs
- Missing files (creates new)
- Invalid input types
- Empty database operations
- File I/O errors

## 🎓 Academic Use

Perfect for:

- Data Structures course projects
- OOP demonstrations
- C++ learning exercises
- Software engineering portfolios
- Interview preparation

## 📄 License

Free to use for educational purposes.

## 👨‍💻 Author

Created as an advanced C++ learning project demonstrating real-world application development.

---

**Happy Coding! 🚀**
