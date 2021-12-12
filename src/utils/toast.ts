import { toast } from '@zerodevx/svelte-toast'

export const success = m => toast.push(m, {
  theme: {
    '--toastBackground': 'linear-gradient(to right, rgb(134, 139, 247), rgb(108, 199, 248))',
    '--toastColor': 'white',
    '--toastBarBackground': '#1E3A8A'
  }
})

export const warning = m => toast.push(m, {
  theme: {
    '--toastBackground': 'green',
    '--toastColor': 'white',
    '--toastBarBackground': 'olive'
  }
})

export const error = m => toast.push(m, {
  theme: {
    '--toastBackground': '#F87171',
    '--toastColor': 'white',
    '--toastBarBackground': '#B45309'
  }
})