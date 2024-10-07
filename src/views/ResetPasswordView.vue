<template>
    <div>
        <v-container>
            <v-row justify="center">
                <v-col md="6" sm="12">
                    <v-card>
                        <v-card-title>
                            <h3>Resetear Password</h3>
                        </v-card-title>
                        <v-card-text>
                            <v-form>
                                <v-text-field label="ingrese el mail con el cual se registró" required
                                    variant="outlined"></v-text-field>
                                <v-btn color="primary" block>
                                    enviar
                                </v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {


}
</script>

<style scoped></style>