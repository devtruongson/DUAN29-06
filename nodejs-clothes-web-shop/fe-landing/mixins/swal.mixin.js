import Swal from 'sweetalert2';

const swToastInstance = Swal.mixin({
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    toast: true
});

export const swalert = Swal.mixin({
    confirmButtonText: '<i class="fas fa-check"></i> Chấp nhận',
    cancelButtonText: '<i class="fas fa-xmark"></i> Hủy bỏ'
});

export const swtoast = {
    fire(config) {
        swToastInstance.fire({
            ...config,
            toast: true
        });
    },

    success(config) {
        swToastInstance.fire({
            ...config,
            icon: 'success',
            toast: true
        });
    },

    error(config) {
        swToastInstance.fire({
            icon: 'error',
            ...config,
            color: '#f00',
            toast: true
        });
    }
};
