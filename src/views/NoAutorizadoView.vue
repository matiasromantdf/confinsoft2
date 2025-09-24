<template>
    <v-container class="no-autorizado-container" fill-height>
        <v-row align="center" justify="center" class="h-100">
            <v-col cols="12" md="6" class="text-center">
                <v-icon color="red" size="80">mdi-lock-alert</v-icon>
                <h1 class="titulo">Funcionalidad no autorizada</h1>
                <p class="mensaje">No tienes permisos para ver esta página.<br>Si crees que es un error, contacta al
                    administrador.</p>
                <v-btn color="primary" class="mt-4" @click="$router.push('/')">Volver al inicio</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {

    }
</script>

<style scoped>
    .no-autorizado-container {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f8fafc 0%, #f3e7e9 100%);
    }

    .titulo {
        color: #b71c1c;
        font-weight: bold;
        margin-top: 16px;
        margin-bottom: 8px;
        font-size: 2.2rem;
    }

    .mensaje {
        color: #444;
        font-size: 1.1rem;
        margin-bottom: 24px;
    }
</style>