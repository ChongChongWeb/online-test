import http from "../utils/http.js";


/** 系统接口 */
export function login(param){
	
	return http.post('/login/', param);
}
export function exit(token){
	
	return http.post('/exit/', {token: token});
}
export function getLoginUser(token){
	
	return http.get('/info/', {params: {token: token}});
}
export function updSessionInfo(param){
	
	return http.post('/info/', param);
}
export function updSessionPwd(param){
	
	return http.post('/pwd/', param);
}

/** 学院信息处理接口 */
export function getAllColleges(){

	return http.get('/colleges/all/');
}
export function getPageColleges(pageIndex, pageSize, name){

	return http.get('/colleges/page/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, name: name}});
}
export function addColleges(params){
	
	return http.post('/colleges/add/', params);
}
export function updColleges(params){
	
	return http.post('/colleges/upd/', params);
}
export function delColleges(id){
	
	return http.post('/colleges/del/', {id: id});
}

/** 班级信息处理接口 */
export function getAllGrades(){

	return http.get('/grades/all/');
}
export function getPageGrades(pageIndex, pageSize, name){

	return http.get('/grades/page/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, name: name}});
}
export function addGrades(params){
	
	return http.post('/grades/add/', params);
}
export function updGrades(params){
	
	return http.post('/grades/upd/', params);
}
export function delGrades(id){
	
	return http.post('/grades/del/', {id: id});
}

/** 科目信息处理接口 */
export function getAllProjects(){

	return http.get('/projects/all/');
}
export function getPageProjects(pageIndex, pageSize, name){

	return http.get('/projects/page/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, name: name}});
}
export function addProjects(params){
	
	return http.post('/projects/add/', params);
}
export function updProjects(params){
	
	return http.post('/projects/upd/', params);
}
export function delProjects(id){
	
	return http.post('/projects/del/', {id: id});
}

/** 学生信息处理接口 */
export function getPageStudents(pageIndex, pageSize, name, collegeId, gradeId){

	return http.get('/students/page/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, name: name, collegeId: collegeId, gradeId: gradeId}});
}
export function getStudentInfo(id){

	return http.get('/students/info/', {params: {id: id}});
}
export function addStudents(params){
	
	return http.post('/students/add/', params);
}
export function updStudents(params){
	
	return http.post('/students/upd/', params);
}
export function delStudents(id){
	
	return http.post('/students/del/', {id: id});
}

/** 教师信息处理接口 */
export function getPageTeachers(pageIndex, pageSize, name, record, job){

	return http.get('/teachers/page/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, name: name, record: record, job: job}});
}
export function addTeachers(params){
	
	return http.post('/teachers/add/', params);
}
export function updTeachers(params){
	
	return http.post('/teachers/upd/', params);
}
export function delTeachers(id){
	
	return http.post('/teachers/del/', {id: id});
}

/** 习题信息处理接口 */
export function getPagePractises(pageIndex, pageSize, name, type, projectId){

	return http.get('/practises/page/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, name: name, type: type, projectId: projectId}});
}
export function getPractiseInfo(id){

	return http.get('/practises/info/', {params: {id: id}});
}
export function addPractises(params){
	
	return http.post('/practises/add/', params);
}
export function setPractiseAnswer(params){
	
	return http.post('/practises/setanswer/', params);
}

/** 习题选项处理接口 */
export function getOptionsByPId(practiseId){

	return http.get('/options/list/', {params: {practiseId: practiseId}});
}
export function addOptions(params){
	
	return http.post('/options/add/', params);
}
export function updOptions(params){
	
	return http.post('/options/upd/', params);
}

/** 考试信息处理接口 */
export function getPageExams(pageIndex, pageSize, name, teacherId, gradeId, projectId){

	return http.get('/exams/page/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, name: name, 
					teacherId: teacherId, gradeId: gradeId, projectId: projectId}});
}
export function getExamInfo(id){

	return http.get('/exams/info/', {params: {id: id}});
}
export function addExams(params){
	
	return http.post('/exams/add/', params);
}
export function updExams(params){
	
	return http.post('/exams/upd/', params);
}
export function makeExams(id){
	
	return http.post('/exams/make/', {projectId: id});
}

/** 考试记录处理接口 */
export function getPageStudentExamLogs(pageIndex, pageSize, examName, studentId, projectId){

	return http.get('/examlogs/pagestu/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, 
				examName: examName, studentId: studentId, projectId: projectId}});
}
export function getPageTeacherExamLogs(pageIndex, pageSize, examName, token, gradeId, projectId){

	return http.get('/examlogs/pagetea/', 
        {params: {pageIndex: pageIndex, pageSize: pageSize, 
				examName: examName, token: token, 
				gradeId: gradeId, projectId: projectId}});
}
export function getPageExamLog(id){

	return http.get('/examlogs/info/', {params: {id: id}});
}
export function addExamLog(params){
	
	return http.post('/examlogs/add/', params);
}
export function updExamLog(params){
	
	return http.post('/examlogs/upd/', params);
}
export function putExamLog(params){
	
	return http.post('/examlogs/put/', params);
}

/** 答题记录处理接口 */
export function getAnswers(studentId, type, examId){

	return http.get('/answerlogs/answers/', 
        {params: {studentId: studentId, type: type, examId: examId}});
}
export function checkAnswers(studentId, examId){

	return http.get('/answerlogs/check/', 
        {params: {studentId: studentId, examId: examId}});
}
export function addAnswerLog(params){
	
	return http.post('/answerlogs/add/', params);
}
export function aduitAnswerLog(params){
	
	return http.post('/answerlogs/audit/', params);
}