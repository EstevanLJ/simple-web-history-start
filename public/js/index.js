let vm = new Vue({
    el: '#app',
    data: {
        site_selecionado: null,
        historicos: [],
        exibir_modal: false,
        exibir_sucesso: false,
        exibir_erro: false,
        desabilitar_atualizar: false,
        sites: [],
        form: {
            nome: null,
            url: null
        }
    },
    mounted() {
        this.carregarSites();
    },
    methods: {
        selecionouSite(site) {
            if (this.site_selecionado && this.site_selecionado.id == site.id) {
                this.site_selecionado = null;
            } else {
                this.site_selecionado = site;
                this.buscarHistorico(site.id);
            }
        },

        carregarSites() {
            axios.get('/sites').then((response) => {
                this.sites = response.data;
            }).catch((err) => {
                console.log(err);
            })
        },

        atualizarHistorico() {
            this.buscarHistorico(this.site_selecionado.id);
            this.desabilitar_atualizar = true;
            setTimeout(() => {
                this.desabilitar_atualizar = false;
            }, 1000)
        },

        salvarSite() {
            axios.post('/site', {
                nome: this.form.nome,
                url: this.form.url,
            }).then((response) => {
                this.carregarSites();
                this.exibir_sucesso = true;
                this.exibir_erro = false;
                this.fecharModal();
            }).catch(() => {
                this.exibir_sucesso = false;
                this.exibir_erro = true;
                this.fecharModal();
            })
        },

        fecharModal() {
            this.form = {
                nome: null,
                url: null
            }
            this.exibir_modal = false;
        },

        toogleModal() {
            this.form = {
                nome: null,
                url: null
            }
            this.exibir_modal = !this.exibir_modal;
        },

        buscarHistorico(site_id) {
            axios.get('/historico', {
                params: {
                    site_id: site_id
                }
            }).then((response) => {
                this.historicos = response.data;
            }).catch((err) => {
                console.log(err);
            })
        },

        styleLinha(site) {
            return (site.status >= 200 && site.status <= 300) ? 'has-text-success' : ((site.status < 200 || site.status > 300) ? 'has-text-danger' : '');
        },

        converterData(data) {
            return moment.utc(data).local().format('YYYY-MM-DD HH:mm:ss');
        }
    }
});