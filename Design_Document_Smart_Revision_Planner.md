# SYSTEM DESIGN DOCUMENT

## 1. System Architecture
- Frontend-based architecture
- No backend/database
- Uses browser storage (optional)

**Flow:**
User Input → Processing Logic (JS) → Output Plan

---

## 2. High-Level Design (HLD)

Components:
- UI Module (Forms, Buttons)
- Logic Module (Scheduling Algorithm)
- Display Module (Plan + Checklist)

---

## 3. Low-Level Design (LLD)

### Functions:
- `addSubject()` → stores input  
- `generatePlan()` → creates schedule  
- `sortByDate()` → prioritizes subjects  
- `updateChecklist()` → tracks completion  

---

## 4. Modules Description

| Module | Description |
|------|------------|
| Input Module | Takes subject & date input |
| Planning Module | Generates schedule |
| UI Module | Displays plan |
| Checklist Module | Tracks progress |

---

## 5. Database Design (Logical)

(No real DB, but structure shown)

### Table: Subjects

| Field | Type |
|------|------|
| id | int |
| name | string |
| exam_date | date |
| priority | int |

---

## 6. UML Diagrams (Description)

### Use Case Diagram
- User interacts with:
  - Add Subjects
  - Generate Plan
  - Track Progress  

### Class Diagram
- Classes:
  - Subject
  - Planner
  - Checklist  

### Sequence Diagram
- User → Input → System → Generate → Display  

### Activity Diagram
- Start → Input → Process → Generate Plan → Display → End  

---

## 7. Technology Stack

- HTML → Structure  
- CSS → Styling  
- JavaScript → Logic  

---

## 8. Data Flow Explanation

1. User enters data  
2. JS processes input  
3. Data sorted by exam date  
4. Plan generated  
5. Displayed to user  