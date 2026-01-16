<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <h1 class="text-h3 mb-6">Tutoriales</h1>
                    <p class="text-subtitle-1 mb-8">Aprende a usar todas las funciones de CajaPro con estos videos
                        tutoriales</p>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6" lg="4" v-for="(tutorial, index) in tutoriales" :key="index">
                    <v-card elevation="3" class="tutorial-card">
                        <v-card-title class="bg-indigo-lighten-1 text-white">
                            {{ tutorial.titulo }}
                        </v-card-title>
                        <v-card-text class="pt-4">
                            <p class="mb-4">{{ tutorial.descripcion }}</p>
                            <v-btn :href="tutorial.link" target="_blank" color="indigo" variant="flat"
                                prepend-icon="mdi-play-circle" block>
                                Ver Tutorial
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>

                <!-- Mensaje cuando no hay tutoriales -->
                <v-col cols="12" v-if="tutoriales.length === 0">
                    <v-card elevation="2" class="pa-8 text-center">
                        <v-icon size="100" color="grey-lighten-1">mdi-video-outline</v-icon>
                        <h2 class="text-h5 mt-4 mb-2">Próximamente</h2>
                        <p class="text-body-1 text-grey">Los tutoriales estarán disponibles pronto</p>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: 'TutorialesView',
        data() {
            return {
                tutoriales: [
                    {
                        titulo: 'Cargando los primeros artículos',
                        descripcion: 'Aprende cómo cargar tus primeros artículos al sistema de manera rápida y sencilla',
                        link: 'https://www.youtube.com/watch?v=e6b3c4CEKyQ'
                    },
                ]
            }
        }
    }
</script>

<style scoped>
    .tutorial-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        transition: transform 0.3s ease;
    }

    .tutorial-card:hover {
        transform: translateY(-5px);
    }
</style>
