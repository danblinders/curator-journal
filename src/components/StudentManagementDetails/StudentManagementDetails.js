import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const StudentManagementDetails = () => {
  const {id} = useParams();
  const [searchParams] = useSearchParams();
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');

  const [studentData, setStudentData] = useState(null);
  
  useEffect(() => {
    axios.get('https://curator-journal-backend.onrender.com/student-stat', {params:{student_id: id, start_date, end_date}}).then(
      response => {
        if(response.data.type === 'success') {
          setStudentData(response.data.result);
        }
      }
    )
  }, [id, start_date, end_date]);

  const studentSubjectsInfo = studentData?.subjects?.map(subject => {
    return studentData.stats?.filter(stat => {
      return stat.subject_id === subject.subject_id;
    });
  });

  const studentSubjectsMarks = studentSubjectsInfo?.map(item => item && item.length > 0 ? item.map(i => +i.mark) : null);
  const studentSubjectsAverageScore = studentSubjectsMarks && studentSubjectsMarks.length > 0 ? studentSubjectsMarks.map(item => item && item.length > 0 ? item?.reduce((sum, score) => sum + score, 0) / item.length : null) : null;
  const studentSubjectsTotalMissed = studentSubjectsInfo?.map(item => item && item.length > 0 ? item?.filter(stat => stat.attendance === 'н' || stat.attendance === 'б').length : null);
  const studentSubjectsMissedByIllness = studentSubjectsInfo?.map(item => item && item.length > 0 ? item?.filter(stat => stat.attendance === 'б').length : null);

  console.log(studentSubjectsMissedByIllness);

  return (
    <div>
      <h1>{studentData?.student_info.first_name} {studentData?.student_info.second_name} {studentData?.student_info.last_name} <br/> Отчет за: {start_date} - {end_date}</h1>
      <ul className="list">
        <li className="list__item">
          <h2>Успеваемость</h2>
          <ul className="list__sublist">
            {studentData?.subjects?.map((element, id) => {
              return (
                <li className="list__sublist-item">
                  <div className="list__field list__item-wrapper">
                    {id + 1}. {element.subject_name}: <span>{studentSubjectsAverageScore[id] !== null ? studentSubjectsAverageScore[id] : 'За этот период оценок нет'}</span>
                  </div>
                </li>
                );
            })}
          </ul>
        </li>
        <li className="list__item">
          <ul className="list__sublist">
            <h2>Пропущено всего</h2>
            
            {studentData?.subjects?.map((element, id) => {
              return (
                <li className="list__sublist-item">
                  <div className="list__field list__item-wrapper">
                    {id + 1}. {element.subject_name}: <span>{studentSubjectsTotalMissed[id] !== null ? studentSubjectsTotalMissed[id] : 'Данных за этот период нет'}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </li>
        <li className="list__item">
          <ul className="list__sublist">
            <h2>Пропущено по болезни</h2>
            {studentData?.subjects?.map((element, id) => {
              return (
                <li className="list__sublist-item">
                  <div className="list__field list__item-wrapper">
                    {id + 1}. {element.subject_name}: <span>{studentSubjectsMissedByIllness[id] !== null ? studentSubjectsMissedByIllness[id] : 'Данных за этот период нет'}</span>
                  </div>
                </li>

              );
            })}
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default StudentManagementDetails