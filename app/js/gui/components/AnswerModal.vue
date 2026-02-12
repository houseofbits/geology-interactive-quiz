<template>
    <div :class="{visible: visible}" class="modal-overlay">
        <div class="modal-box">
            <div class="header">
                <!-- <img src="@images/move-away.gif" alt=""> -->
                Izvēlies atbildes variantu
            </div>
            <div class="body">
                <div v-for="answer in answers" :key="answer.id" @click="click(answer.id)" class="answer-button">
                    {{ answer.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AnswerModal",
    emits: ['selected'],
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        answers: {
            type: Array,
            required: true
        }
    },
    methods: {
        click(id) {
            this.$emit('selected', id);
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
    top: 0;
    left: 0;
    position: absolute;
    width: 1024px;
    height: 768px;
    background: rgba(150, 150, 150, 0.6);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity;
    transition-duration: 300ms;
    opacity: 0;
    pointer-events: none;

    &.visible {
        opacity: 1;

        & .modal-box {
            transform: scale(1);
            transition-duration: 100ms;
        }
    }

    & .modal-box {
        width: 600px;
        height: auto;
        background: white;
        box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        transition: all;
        transition-duration: 300ms;
        transition-delay: 100ms;
        transform: scale(0);

        & .header {
            width: 100%;
            height: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #606060;
            padding: 16px;
            padding-bottom: 0;
            img {
                margin-right: 16px;
            }
        }

        & .body {
            width: 100%;
            height: 100%;
            display: flex;
            padding: 8px;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;

            & .answer-button {
                transition: all;
                transition-duration: 200ms;
                font-weight: bold;
                text-align: center;
                font-size: 24px;
                color: white;
                background-color: #606060;
                border-radius: 6px;
                padding: 12px 16px;
                margin: 8px;
                box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
                flex-grow: 1;
                pointer-events: auto;

                &:hover {
                    background-color: #2d2d2d;
                    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.4);
                }
            }
        }
    }

}

</style>