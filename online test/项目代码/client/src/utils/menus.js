import {getLoginUser} from "../api";

export const adminMenus = {
    path: '/home',
    name: 'home',
    component: require("../views/home.vue").default,
    children: [
        {
            path: '/welcome',
            name: '系统首页',
            icon: "ios-home",
            component: require("../views/pages/welcome.vue").default
        },
        {
            path: '/colleges',
            name: '学院信息管理',
            icon: "ios-ribbon",
            component: require("../views/pages/colleges.vue").default
        },
        {
            path: '/grades',
            name: '班级信息管理',
            icon: "ios-appstore",
            component: require("../views/pages/grades.vue").default
        },
        {
            path: '/projects',
            name: '考试科目管理',
            icon: "ios-list-box",
            component: require("../views/pages/projects.vue").default
        },
        {
            path: '/students',
            name: '学生信息管理',
            icon: "ios-people",
            component: require("../views/pages/students.vue").default
        },
        {
            path: '/teachers',
            name: '教师信息管理',
            icon: "md-ribbon",
            component: require("../views/pages/teachers.vue").default
        },
        {
            path: '/exams',
            name: '校园考试管理',
            icon: "md-speedometer",
            component: require("../views/pages/exams.vue").default
        }
    ]
}

export const teacherMenus = {
    path: '/home',
    name: 'home',
    component: require("../views/home.vue").default,
    children: [
        {
            path: '/welcome',
            name: '系统首页',
            icon: "ios-home",
            component: require("../views/pages/welcome.vue").default
        },
        {
            path: '/practises',
            name: '习题管理',
            icon: "md-bookmarks",
            component: require("../views/pages/practises.vue").default
        },
        {
            path: '/exams',
            name: '考试安排',
            icon: "ios-glasses-outline",
            component: require("../views/pages/exams.vue").default
        },
        {
            path: '/examlogs/teacher',
            name: '试卷审核',
            icon: "ios-brush",
            component: require("../views/pages/teacherExamLogs.vue").default
        }
    ]
}

export const studentMenus = {
    path: '/home',
    name: 'home',
    component: require("../views/home.vue").default,
    children: [
        {
            path: '/welcome',
            name: '系统首页',
            icon: "ios-home",
            component: require("../views/pages/welcome.vue").default
        },
        {
            path: '/exams',
            name: '考试安排',
            icon: "ios-clock",
            component: require("../views/pages/exams.vue").default
        },
        {
            path: '/examlogs/student',
            name: '考试记录',
            icon: "ios-archive",
            component: require("../views/pages/studentExamLogs.vue").default
        }
    ]
}

export default function initMenu(router, store){

    let token = null;
	if(store.state.token){

		token = store.state.token;
	}else{

		token = sessionStorage.getItem("token");
		store.state.token = sessionStorage.getItem("token");
	}

	getLoginUser(token).then(resp =>{

		if(resp.data.type == 0){
			router.addRoute(adminMenus);
			store.commit("setMenus", adminMenus);
		}
	
		if(resp.data.type == 1){
			router.addRoute(teacherMenus);
			store.commit("setMenus", teacherMenus);
		}
		
		if(resp.data.type == 2){
			router.addRoute(studentMenus);
			store.commit("setMenus", studentMenus);
		}

        router.push('/welcome');
	});
}