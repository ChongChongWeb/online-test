<template>
	<div class="fater-body-show">
        <Card>
            <template #title>
				信息查询
			</template>
			<div>
				<Form :model="qryForm" inline>
					<FormItem prop="name">
						<Input type="text" v-model="qryForm.name" placeholder="练习题目……"></Input>
					</FormItem>
					<FormItem>
						<Select style="width:200px;" v-model="qryForm.type" placeholder="选择题目类型……">
                            <Option value="">查看全部</Option>
                            <Option v-for="(item, index) in types" 
                                :key="index" :value="item.key">{{ item.val }}</Option>
                        </Select>
					</FormItem>
					<FormItem>
						<Select style="width:200px;" v-model="qryForm.projectId" placeholder="选择考核科目……">
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
				<Button @click="showAddWin()" type="primary">
					<Icon type="md-add" />
				</Button>
			</template>
			<div>
				<Table border :columns="columns" :loading="loading" :data="pageInfos">
                    <template #types="{ row }">
                        <Tag v-if="row.type==0" type="border" color="#009999">选择题</Tag>
                        <Tag v-if="row.type==1" type="border" color="#9933FF">填空题</Tag>
                        <Tag v-if="row.type==2" type="border" color="#FF9900">判断题</Tag>
                        <Tag v-if="row.type==3" type="border" color="#66CC00">编程题</Tag>
                    </template>
                    <template #settings="{ row }">
                        <Button v-if="row.type==0 && row.optionTotal<4"
                            @click="showSetOptionsWin(row.id)" size="small" type="success">选项设置</Button>
                        <Button v-else @click="showSetAnswerWin(row)"
                                size="small" type="warning">答案设置</Button>
                    </template>
				</Table>
				<Page style="margin-top: 15px;" v-if="pageTotal > 1" :current="pageIndex"
					@on-change="handleCurrentChange" :total="totalInfo" show-total/>
			</div>
		</Card>

        <Modal v-model="showAddFlag"
			title="信息编辑" ok-text="提交" cancel-text="取消" @on-ok="addInfo()">
			<Form :label-width="80" :model="practiseForm">
				<FormItem label="题目名称">
					<Input v-model="practiseForm.name" placeholder="请输入题目名称..."></Input>
				</FormItem>
                <FormItem label="题目类型">
                    <Select style="width:100%;" v-model="practiseForm.type" placeholder="选择题目类型……">
                        <Option v-for="(item, index) in types" 
                            :key="index" :value="item.key">{{ item.val }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="考核科目">
                    <Select style="width:100%;" v-model="practiseForm.projectId" placeholder="选择考核科目……">
                        <Option v-for="(item, index) in projects" 
                            :key="index" :value="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
			</Form>
		</Modal>

        <Modal v-model="showSetAnswerFlag"
			title="习题答案" ok-text="提交" cancel-text="取消" @on-ok="setAnswer()">
			<Form :label-width="80" :model="practiseForm">
				<FormItem label="参考答案">
                    <Select v-if="practiseForm.type==0" style="width:100%" 
                            v-model="practiseForm.answer" placeholder="选择正确选项……">
                        <Option v-for="(item, index) in options" 
                            :key="index" :value="item.id">{{ item.name }}</Option>
                    </Select>
					<Input v-else-if="practiseForm.type==1"  v-model="practiseForm.answer" 
                                    placeholder="请输入参考答案..."></Input>
                    <RadioGroup v-else-if="practiseForm.type==2" v-model="practiseForm.answer">
                        <Radio label="正确">正确</Radio>
                        <Radio label="错误">错误</Radio>
                    </RadioGroup>
					<Input v-else-if="practiseForm.type==3"  v-model="practiseForm.answer" 
                        type="textarea" :rows="4" placeholder="请输入参考答案..."></Input>
				</FormItem>
				<FormItem label="题目分析">
					<Input v-model="practiseForm.analyse" 
                        type="textarea" :rows="4" placeholder="请输入题目分析..."></Input>
				</FormItem>
			</Form>
		</Modal>

        <Modal width="900"
            v-model="showReferOptionsFlag" footer-hide="true" title="选项设置">
            <Card>
                <template #title>
                    <Button v-if="options.length<4" @click="showAddOptionWin()" type="primary">
                        <Icon type="md-add" />
                    </Button>
                    <Button v-else disabled type="primary">
                        <Icon type="md-add" />
                    </Button>
                </template>
                <div>
                    <Table border :columns="optionCols" :data="options"></Table>
                </div>
            </Card>
        </Modal>

        <Modal width="300" v-model="showAddOptionsFlag" @on-ok="addOptionInfo()"
                ok-text="提交" cancel-text="取消" title="添加选项">
            <Form :label-width="80" :model="optionForm">
				<FormItem label="习题选项">
					<Input v-model="optionForm.name" placeholder="请输入题目选项..."></Input>
				</FormItem>
			</Form>
        </Modal>
    </div>
</template>

<style></style>

<script>
import {
    getAllProjects,
    getPagePractises,
    addPractises,
    setPractiseAnswer,
    getOptionsByPId,
    addOptions,
    updOptions,
} from '../../api/index.js';
export default{
		
    data(){
        return {
            types: [
                {key: 0, val: '选择题'},{key: 1, val: '填空题'},
                {key: 2, val: '判断题'},{key: 3, val: '编程题'},
            ],
            options: [],
            projects: [],
            pageInfos: [],
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            totalInfo: 0,
            loading: true,
            showAddFlag: false,
            showSetAnswerFlag: false,
            showReferOptionsFlag: false,
            showAddOptionsFlag: false,
            qryForm: {
                name: "",
                type: "",
                projectId: ""
            },
            practiseForm: {
                id: "",
                name: "",
                answer: "无",
                analyse: "",
                type: "",
                projectId: "",
            },
            optionForm: {
                id: "",
                name: "",
                practiseId: "",
            },
            columns: [
                {title: '序号', type: 'index', width: 70, align: 'center'},
                {title: '考试题目', key: 'name', width: 750, align: 'left'},
                {title: '针对科目', key: 'projectName', align: 'center'},
                {title: '题目类型', slot: 'types', align: 'center'},
                {title: '答案设置', slot: 'settings', align: 'center'}
            ],
            optionCols: [
                {title: '序号', type: 'index', width: 70, align: 'center'},
                {title: '选项', key: 'name', align: 'left'},
            ],
        }
    },
    methods:{
		getPageInfo(pageIndex, pageSize) {
			
            getPagePractises(pageIndex, pageSize, 
                    this.qryForm.name, this.qryForm.type, this.qryForm.projectId).then(resp => {
                
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
        showSetAnswerWin(row) {
			
            this.practiseForm ={
                id: "",
                name: "",
                answer: "无",
                analyse: "",
                type: "",
                projectId: "",
            }

            if(row.type == 0){

                getOptionsByPId(row.id).then(res =>{
                   
                    this.practiseForm = row;

                    this.options = res.data;
                    
                    this.showSetAnswerFlag = true;
                });
            }else{
                this.practiseForm = row;
                this.showSetAnswerFlag = true;
            }
        },
        addOptionInfo(){

            addOptions(this.optionForm).then(resp =>{

                getOptionsByPId(this.optionForm.practiseId).then(res =>{

                    this.options = res.data;
                    this.$Notice.success({
                        duration: 3,
                        title: res.msg
                    });
                    this.showAddOptionsFlag = false;
                    
                    if(res.data.length == 4){

                        this.getPageInfo(1, this.pageSize);
                    }
                });
                
            });
        },
        showSetOptionsWin(id){

            getOptionsByPId(id).then(resp =>{

                this.options = resp.data;
                this.showReferOptionsFlag = true;
                this.optionForm.practiseId = id;
            });
        },
        showAddOptionWin(){

            this.optionForm = {
                id: "",
                name: "",
                practiseId: this.optionForm.practiseId
            }

            this.showAddOptionsFlag = true;
        },
        showAddWin(){

            this.practiseForm ={
                id: "",
                name: "",
                answer: "无",
                analyse: "",
                type: "",
                projectId: "",
            }

            this.showAddFlag = true;
        },
        addInfo() {
			
            addPractises(this.practiseForm).then(resp => {
                
                this.$Notice.success({
                    duration: 3,
                    title: resp.msg
                });
                
                this.getPageInfo(1, this.pageSize);
                
                this.showAddFlag = false;
            });
        },
        setAnswer() {
            
            setPractiseAnswer(this.practiseForm).then(resp => {
        
                this.$Notice.success({
                    duration: 3,
                    title: resp.msg
                });
        
                this.getPageInfo(1, this.pageSize);
        
                this.showUpdFlag = false;
            });
        }
    },
    mounted(){

        getAllProjects().then(resp =>{

            this.projects = resp.data;
        });
        this.getPageInfo(1, this.pageSize);
    }
}
</script>