# Makefile for Student Management System

CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
TARGET = student_management
OBJS = main.o Student.o StudentDatabase.o

# Default target
all: $(TARGET)

# Link object files
$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJS)
	@echo "Build complete! Run with: ./$(TARGET)"

# Compile main.cpp
main.o: main.cpp Student.h StudentDatabase.h
	$(CXX) $(CXXFLAGS) -c main.cpp

# Compile Student.cpp
Student.o: Student.cpp Student.h
	$(CXX) $(CXXFLAGS) -c Student.cpp

# Compile StudentDatabase.cpp
StudentDatabase.o: StudentDatabase.cpp StudentDatabase.h Student.h
	$(CXX) $(CXXFLAGS) -c StudentDatabase.cpp

# Clean build files
clean:
	rm -f $(OBJS) $(TARGET) students.dat students_export.csv
	@echo "Clean complete!"

# Run the program
run: $(TARGET)
	./$(TARGET)

# For Windows (PowerShell)
run-windows: $(TARGET)
	.\$(TARGET).exe

# Build and run
build-run: all run
