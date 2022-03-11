<script lang="ts">
    export let gradient = false;
</script>

{#if gradient}
    <svg  viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad" x1="0" x2="100%" y1="0" y2="0">
            <stop offset="0%" stop-color="#868BF7"/>
            <stop offset="100%" stop-color="#6CC7F8"/>
        </linearGradient>
    </defs>
        <circle cx="20" cy="20" r="19.75" stroke="url(#grad)" stroke-width="0.5"/>
        <g transform="translate(-2,-2)">
            <path d="M12.7869 20V14.3693H11V12.3419H12.7869V10.6103C12.7869 9.24958 13.8425 8 16.2747 8C17.2595 8 17.9877 8.07866 17.9877 8.07866L17.9303 9.97185C17.9303 9.97185 17.1876 9.96583 16.3772 9.96583C15.5002 9.96583 15.3596 10.3026 15.3596 10.8616V12.3419H18L17.8851 14.3693H15.3596V20H12.7869Z" fill="url(#grad)" class='scale-150'/>
        </g>
    </svg>
{:else}
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19.75" stroke="currentColor" stroke-width="0.5"/>
    <g transform="translate(-2,-2)">
    <path d="M12.7869 20V14.3693H11V12.3419H12.7869V10.6103C12.7869 9.24958 13.8425 8 16.2747 8C17.2595 8 17.9877 8.07866 17.9877 8.07866L17.9303 9.97185C17.9303 9.97185 17.1876 9.96583 16.3772 9.96583C15.5002 9.96583 15.3596 10.3026 15.3596 10.8616V12.3419H18L17.8851 14.3693H15.3596V20H12.7869Z" fill="currentColor" class='scale-150'/>
    </g>
    </svg>
{/if}

