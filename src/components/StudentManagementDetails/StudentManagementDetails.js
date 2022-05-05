import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StudentManagementDetails = () => {
  const {id} = useParams();

  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/student-stat', {params:{student_id: id}}).then(
      response => {
        setStudentData(response.data);
      }
    )
  }, [id]);

  const studentSubjectsInfo = studentData?.subjects?.map(subject => {
    return studentData.stats?.filter(stat => stat.subject_id === subject.subject_id);
  });

  console.log(studentSubjectsInfo);

  const studentSubjectsAverageScore = studentSubjectsInfo?.map(item => item.map(i => +i.mark)).map(item => item?.reduce((sum, score) => sum + score) / item.length);
  const studentSubjectsTotalMissed = studentSubjectsInfo?.map(item => item?.filter(stat => stat.attendance === 'н' || stat.attendance === 'б').length);
  const studentSubjectsMissedByIllness = studentSubjectsInfo?.map(item => item?.filter(stat => stat.attendance === 'б').length);

  return (
    <div>
      <h1>{studentData?.student_info.first_name} {studentData?.student_info.last_name}</h1>
      <div className="studying">
        <h2>Успеваемость</h2>
        {studentData?.subjects?.map((element, id) => {
          return `${element.subject_name}: ${studentSubjectsAverageScore[id]}`;
        })}
      </div>
      <div className="attendance-total">
        <h2>Пропущено всего</h2>
        {studentData?.subjects?.map((element, id) => {
          return `${element.subject_name}: ${studentSubjectsTotalMissed[id]}`;
        })}
      </div>
      <div className="attendance-illness">
        <h2>Пропущено по болезни</h2>
        {studentData?.subjects?.map((element, id) => {
          return `${element.subject_name}: ${studentSubjectsMissedByIllness[id]}`;
        })}
      </div>
    </div>
  )
}

export default StudentManagementDetails