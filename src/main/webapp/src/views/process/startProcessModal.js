define([ 'vue', 'html!views/process/startProcessModal.html', 'globalConst', 'apis/processService' ],
    function(Vue, html, globalConst, processService) {


    var startProcessModal = Vue.extend({
        template : html,
        data () {
            return {
                localShowModal: false,
                processDefinitionId: '',
                startFormModel: {}
            }
        },
        methods: {
            getStartForm (processDefinitionId) {
                processService.getProcessStartForm(processDefinitionId).then((response) => {

                    this.startFormModel = new Vue({
                        el: '#startFormContent',
                        template: '<div><template>' + response.data + '</template></div>',
                        data() {
                            return {
                                model: {}
                            }
                        }
                    })

                }).catch((error) => {
                    console.log(error)
                })
            },
            show (showModal, processDefinitionId) {
                this.localShowModal = showModal
                this.processDefinitionId = processDefinitionId

                this.getStartForm(processDefinitionId)
            },
            start () {
                var startFormModelContent = this.startFormModel.$data.model;

                var params = ''
                for(var key in startFormModelContent) {

                    var value = startFormModelContent[key]

                    if(value instanceof Date) {
                        value = Vue.filter('localDateString')(value)
                    }
                    params += key + "=" + value + "&"
                }

                processService.startProcess(this.processDefinitionId, params).then((response) => {

                    var result = response.data
                    if('success' === result.state) {

                        this.$Message.success({
                            content: result.msg,
                            duration: 5
                        });

                        this.localShowModal = false
                    }
                    else {
                        this.$Message.error(result.msg)
                    }

                }).catch((error) => {
                    console.log(error)
                    this.$Message.error('流程启动失败!')
                })
            },
            cancel () {
                this.localShowModal = false
            }
        }
    })

    Vue.component('start-process-modal-component', startProcessModal)
})
