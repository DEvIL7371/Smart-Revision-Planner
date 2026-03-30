# SOFTWARE REQUIREMENT SPECIFICATION (SRS)

## Title Page
**Project Title:** Smart Revision Planner (Exam Mode)  
**Prepared By:** [Your Name]  
**Date:** [Insert Date]  
**Version:** 1.0  

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the requirements of the Smart Revision Planner system. It helps students generate an efficient revision schedule based on exam dates and subjects.

### 1.2 Scope
The system allows users to:
- Enter subjects and exam dates
- Automatically generate a revision plan
- Prioritize subjects based on urgency
- Track daily revision progress

### 1.3 Definitions, Acronyms
- SRS: Software Requirement Specification  
- UI: User Interface  
- JS: JavaScript  
- Planner: Schedule generator system  

---

## 2. Overall Description

### 2.1 Product Perspective
- A standalone web application
- Runs in browser (no backend required)

### 2.2 Product Features
- Input subjects and exam dates  
- Auto-generate revision schedule  
- Priority-based planning  
- Daily checklist  

### 2.3 User Classes
- Students (Primary users)
- Beginners (Non-technical users)

### 2.4 Operating Environment
- Web Browser (Chrome, Edge, Firefox)
- OS: Windows / Mac / Linux
- Technologies: HTML, CSS, JavaScript  

---

## 3. Functional Requirements

1. User can enter subject names  
2. User can input exam dates  
3. System generates revision plan automatically  
4. System prioritizes subjects based on nearest exam  
5. User can view daily tasks  
6. User can mark tasks as completed  
7. System updates checklist dynamically  

---

## 4. Non-Functional Requirements

- Performance: Fast response (<2 sec)
- Usability: Simple UI
- Reliability: Accurate scheduling
- Portability: Works on all browsers
- Maintainability: Easy to update code  

---

## 5. System Constraints

- No database (data stored temporarily)
- Internet browser required
- Limited to small-scale use  

---

## 6. Assumptions & Dependencies

- User enters correct exam dates  
- System depends on browser compatibility  
- User uses basic UI features  

---

## 7. Use Case Descriptions

### Use Case 1: Enter Subjects
- Actor: User  
- Description: User inputs subjects and dates  
- Outcome: Data stored for planning  

### Use Case 2: Generate Plan
- Actor: System  
- Description: Generates schedule automatically  
- Outcome: Revision plan displayed  

### Use Case 3: Track Progress
- Actor: User  
- Description: Marks tasks complete  
- Outcome: Checklist updated  