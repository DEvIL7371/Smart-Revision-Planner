# SOFTWARE TESTING DOCUMENT

## 1. Introduction to Testing
Testing ensures that the system works correctly and meets requirements.

---

## 2. Testing Objectives

- Validate inputs  
- Ensure correct plan generation  
- Check UI functionality  
- Detect bugs  

---

## 3. Types of Testing

- Unit Testing → Functions  
- Integration Testing → Modules interaction  
- System Testing → Full system  
- User Acceptance Testing → Real user validation  

---

## 4. Test Plan

- Test environment: Browser  
- Test data: Sample subjects & dates  
- Test strategy: Manual testing  

---

## 5. Test Cases

| Test ID | Description | Input | Expected Output |
|--------|------------|------|----------------|
| TC1 | Add subject | Math, 10 May | Subject added |
| TC2 | Generate plan | 3 subjects | Plan displayed |
| TC3 | Priority check | Different dates | Sorted correctly |
| TC4 | Checklist update | Mark complete | Task updated |
| TC5 | Invalid input | Empty fields | Error message |

---

## 6. Expected Results

- System generates correct schedule  
- No crashes  
- UI responds properly  

---

## 7. Bug Reporting Format

- Bug ID  
- Description  
- Steps to reproduce  
- Expected Result  
- Actual Result  
- Status (Open/Closed)  

---

## 8. Conclusion

The system is tested for functionality, usability, and reliability. It meets all basic requirements and is suitable for student use.