<template>
	<div class="fater-body-show">
        <Card>
            <template #title>
				信息查询
			</template>
			<div>
				<Form :model="qryForm" inline>
					<FormItem prop="name">
						<Input type="text" v-model="qryForm.name" placeholder="考试名称……"></Input>
					</FormItem>
                    <FormItem v-if="userInfo.type != 2">
						<Select style="width:200px;" v-model="qryForm.gradeId" placeholder="选择考试班级……">
                            <Option value="">查看全部</Option>
                            <Option v-for="(item, index) in grades" 
                                :key="index" :value="item.id">{{ item.name }}</Option>
                        </Select>
					</FormItem>
                    <FormItem>
						<Select style="width:200px;" v-model="qryForm.projectId" placeholder="选择考试科目……">
                            <Option value="">查看全部</Option>
                            <Option v-for="(item, index) in projects" 
                                :key="index" :value="item.id">{{ item.name }}</Option>
                        </Select>
					</FormItem>
					<FormItem>
						<Button type="primary" @click="getPageInfo()">
							<Icon type="ios-search" />
						</Button>
					</FormItem>
				</Form>
			</div>
		</Card>

        <Card>
			<template #title>
				<Button v-if="userInfo.type == 0" @click="showAddWin()" type="primary">
					<Icon type="md-add" />
				</Button>
			</template>
			<div>
				<Table border :columns="columns" :loading="loading" :data="pageInfos">
                    <template #action="{ row }">
                        <Tag type="border" v-if="row.status == 1" color="#009966">等待开考</Tag>
                        <Button v-else-if="row.status == 0" 
                            @click="startExam(row.id)" size="small" type="info">开始考试</Button>
                        <Tag type="border" v-else  color="#FF9900">考试结束</Tag>
					</template>
				</Table>
				<Page style="margin-top: 15px;" v-if="pageTotal > 1" :current="pageIndex"
					@on-change="handleCurrentChange" :total="totalInfo" show-total/>
			</div>
		</Card>

        <Modal width="700" v-model="showAddFlag"
			title="信息编辑" ok-text="提交" cancel-text="取消" @on-ok="addInfo()">
			<Form :label-width="80" :model="examForm">
				<FormItem label="考试名称">
					<Input v-model="examForm.name" placeholder="请输入考试名称..."></Input>
				</FormItem>
				<FormItem label="考试时间">
                    <DatePicker v-model="examForm.examTime" 
                            type="datetime" placeholder="请选择考试时间..." style="width: 100%" />
				</FormItem>
				<FormItem label="审核教师">
					<Input v-model="examForm.teacherId" placeholder="请输入审核教师工号..."></Input>
				</FormItem>
				<FormItem label="考核班级">
                    <Select style="width: 100%" v-model="examForm.gradeId" placeholder="选择考试班级……">
                        <Option v-for="(item, index) in grades" 
                            :key="index" :value="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
				<FormItem label="考核科目">
                    <Select style="width: 100%" v-model="examForm.projectId" placeholder="选择考试科目……">
                        <Option v-for="(item, index) in projects" 
                            :key="index" :value="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
			</Form>
		</Modal>
    </div>
</template>

<style></style>

<script>
import {
    getLoginUser,
    getAllProjects,
    getAllGrades,
    getPageExams,
    addExams,
    updExams,
    addExamLog
} from '../../api/index.js';
import {
    formatDate,
    contrastNow
} from '../../utils/date.js';
export default{
		
    data(){
        return {
            userInfo: {},
            projects: [],
            grades: [],
            pageInfos: [],
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            totalInfo: 0,
            loading: true,
            showAddFlag: false,
            qryForm: {
                name: "",
                gradeId: "",
                projectId: "",
                teacherId: ""
            },
            examForm: {
                id: "",
                name: "",
                examTime: "",
                gradeId: "",
                projectId: "",
                teacherId: ""
            },
            columns: []
        }
    },
    methods:{
		getPageInfo(pageIndex, pageSize) {
			
            getPageExams(pageIndex, pageSize, 
                    this.qryForm.name, this.qryForm.teacherId, 
                    this.qryForm.gradeId, this.qryForm.projectId).then(resp => {
                
                resp.data.data.forEach(item =>{

                    item.status = contrastNow(item.examTime);
                });

                this.pageInfos = resp.data.data;
                this.pageIndex = resp.data.pageIndex;
                this.pageSize = resp.data.pageSize;
                this.pageTotal = resp.data.pageTotal;
                this.totalInfo = resp.data.count;
        
                this.loading = false;
            });
        },
        handleCurrentChange(pageIndex) {
        
            this.getPageInfo(pageIndex, this.pageSize);
        },	
        showAddWin(){

            this.examForm = {
                id: "",
                name: "",
                examTime: "",
                gradeId: "",
                projectId: "",
                teacherId: ""
            }
            this.showAddFlag = true;
        },
        addInfo() {
			
            this.examForm.examTime = formatDate(this.examForm.examTime);
            addExams(this.examForm).then(resp => {
                
                if(resp.code == 0){

                    this.$Notice.success({
                        duration: 3,
                        title: resp.msg
                    });
                    
                    this.getPageInfo(1, this.pageSize);
                    
                    this.showAddFlag = false;
                }else{

                    this.$Message.warning({
                        background: true,
                        content: resp.msg
                    });
                    this.showAddFlag = true;
                }
            });
        },
        startExam(id){

            addExamLog({
                token: this.$store.state.token,
                examId: id
            }).then(resp =>{
                this.$router.push({
                    path: 'answer',
                    query: {
                        id: id
                    }
                });
            });
        }	
    },
    mounted(){

        getLoginUser(this.$store.state.token).then(resp =>{

            this.userInfo = resp.data;

            if(this.userInfo.type == 0){

                this.columns = [
                    {title: '序号', type: 'index', width: 70, align: 'center'},
                    {title: '考试名称', key: 'name', align: 'center'},
                    {title: '考试时间', key: 'examTime', align: 'center'},
                    {title: '考试科目', key: 'projectName', align: 'center'},
                    {title: '考试班级', key: 'gradeName', align: 'center'},
                    {title: '审核教师', key: 'teacherName', align: 'center'}
                ]
                this.getPageInfo(1, this.pageSize);
            }else if(this.userInfo.type == 1){

                this.columns = [
                    {title: '序号', type: 'index', width: 70, align: 'center'},
                    {title: '考试名称', key: 'name', align: 'center'},
                    {title: '考试时间', key: 'examTime', align: 'center'},
                    {title: '考试科目', key: 'projectName', align: 'center'},
                    {title: '考试班级', key: 'gradeName', align: 'center'}
                ]
                this.qryForm.teacherId = this.userInfo.id;
                this.getPageInfo(1, this.pageSize);
            }else if(this.userInfo.type == 2){

                this.columns = [
                    {title: '序号', type: 'index', width: 70, align: 'center'},
                    {title: '考试名称', key: 'name', align: 'center'},
                    {title: '考试时间', key: 'examTime', align: 'center'},
                    {title: '考试科目', key: 'projectName', align: 'center'},
                    {title: '考试班级', key: 'gradeName', align: 'center'},
                    {title: '审核教师', key: 'teacherName', align: 'center'},
                    {title: '操作', slot: 'action', align: 'center'}
                ]
                this.qryForm.gradeId = this.userInfo.gradeId;
                this.getPageInfo(1, this.pageSize);
            }
        });
        getAllProjects().then(resp =>{

            this.projects = resp.data;
        });
        getAllGrades().then(resp =>{

            this.grades = resp.data;
        });
    }
}
</script>