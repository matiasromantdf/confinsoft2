<template>
    <v-container class="py-8">
        <v-row justify="center">
            <v-col cols="12" md="8" lg="12">
                <v-card elevation="8" class="rounded-lg">
                    <v-card-title class="text-h4 text-center pa-6 bg-gradient">
                        <v-icon size="40" class="mr-3" color="white">mdi-email-outline</v-icon>
                        <span class="text-white">Contáctanos</span>
                    </v-card-title>

                    <v-card-text class="pa-8">
                        <v-row class="mb-4">
                            <v-col cols="12" class="text-center">
                                <h2 class="text-h5 mb-3">¿Necesitas ayuda?</h2>
                                <p class="text-body-1 text-medium-emphasis">
                                    Envianos un mensaje y nuestro equipo de soporte se pondrá en contacto con vos lo
                                    antes posible. Estamos para ayudarte con cualquier consulta o problema que
                                    puedas tener.
                                </p>
                            </v-col>
                        </v-row>
                        <!-- Información adicional -->
                        <v-row>
                            <v-col cols="12">
                                <v-alert border="start" border-color="primary" elevation="2" type="info"
                                    variant="tonal">
                                    <v-row align="center">
                                        <v-col cols="auto">
                                            <v-icon size="30">mdi-lightbulb-on-outline</v-icon>
                                        </v-col>
                                        <v-col>
                                            <h4 class="text-subtitle-1 font-weight-bold mb-2">
                                                ¿Tienes una idea genial?
                                            </h4>
                                            <p class="text-body-2 mb-0">
                                                Nos encanta escuchar tus sugerencias para mejorar la aplicación.
                                                También puedes solicitar nuevas funciones que te ayuden en tu negocio.
                                            </p>
                                        </v-col>
                                    </v-row>
                                </v-alert>
                            </v-col>
                        </v-row>

                        <v-divider class="my-6"></v-divider>

                        <!-- Email -->
                        <v-row class="mb-6">
                            <v-col cols="12">
                                <v-card elevation="2" class="pa-4 hover-card" color="blue-grey-lighten-5">
                                    <v-row align="center">
                                        <v-col cols="auto">
                                            <v-avatar color="blue" size="60">
                                                <v-icon size="35" color="white">mdi-email</v-icon>
                                            </v-avatar>
                                        </v-col>
                                        <v-col>
                                            <h3 class="text-h6 mb-2">Correo Electrónico</h3>
                                            <p class="text-body-2 text-medium-emphasis mb-2">
                                                Envíanos un email con tus consultas
                                            </p>
                                            <a href="mailto:confinsoft@gmail.com"
                                                class="text-blue text-decoration-none font-weight-medium"
                                                target="_blank">
                                                <v-icon size="small" class="mr-1">mdi-open-in-new</v-icon>
                                                Enviar email
                                            </a>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- WhatsApp -->
                        <v-row class="mb-6">
                            <v-col cols="12">
                                <v-card elevation="2" class="pa-4 hover-card" color="green-lighten-5">
                                    <v-row align="center">
                                        <v-col cols="auto">
                                            <v-avatar color="green" size="60">
                                                <v-icon size="35" color="white">mdi-whatsapp</v-icon>
                                            </v-avatar>
                                        </v-col>
                                        <v-col>
                                            <h3 class="text-h6 mb-2">WhatsApp</h3>
                                            <p class="text-body-2 text-medium-emphasis mb-2">
                                                Chatea con nosotros directamente
                                            </p>
                                            <a href="https://wa.me/5491171182558"
                                                class="text-green-darken-2 text-decoration-none font-weight-medium"
                                                target="_blank">
                                                <v-icon size="small" class="mr-1">mdi-open-in-new</v-icon>
                                                +54 9 11 7118-2558
                                            </a>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-divider class="my-6"></v-divider>



                        <!-- Horario -->
                        <v-row class="mt-4">
                            <v-col cols="12" class="text-center">
                                <v-chip color="primary" variant="flat" size="large" class="px-6">
                                    <v-icon start>mdi-clock-outline</v-icon>
                                    Horario de atención: Lunes a Viernes, 9:00 - 18:00 hs
                                </v-chip>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    // No se requiere lógica adicional
</script>

<style scoped>
    .bg-gradient {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .hover-card {
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .hover-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
    }

    .rounded-lg {
        border-radius: 16px;
    }
</style>
