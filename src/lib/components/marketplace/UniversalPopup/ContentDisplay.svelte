<script lang='ts'>
	import TabSwitcher from './TabSwitcher.svelte';
    import { fade } from 'svelte/transition';
    import LongLeftArrow from '$icons/long-left-arrow.svelte';
    import CardHistoryTab from '../UniversalPopup/CardHistoryTab.svelte';

    export let tab = 0;
	export let buyScreen = false;
	export let successScreen = false;
</script>

{#if buyScreen}
    <div in:fade={{ duration: 300 }} class="h-full flex flex-col justify-between mb-5">
        <div class='mt-2'>
            <slot name='buy-screen-back-bt'>
                <button class='flex items-center gap-2 ml-auto' on:click={() => {buyScreen = false; successScreen = false;}}>
                    <LongLeftArrow/>
                    <p class='text-color-black font-semibold text-sm'>GO BACK</p>
                </button>
            </slot>
            <div class="h-px w-full mt-1 bg-color-black bg-opacity-30" />
        </div>
        <slot name='buy-screen'></slot>
        <slot name='buy-screen-footer'></slot>
    </div>
{:else if successScreen}
    <div in:fade={{ duration: 300 }} class="h-full flex flex-col justify-between">
        <div class='mt-2'>
            <slot name='success-screen-back-bt'>
                <button class='flex items-center gap-2 ml-auto' on:click={() => {buyScreen = true; successScreen = false;}}>
                    <LongLeftArrow/>
                    <p class='text-color-black font-semibold text-sm'>GO BACK</p>
                </button>
            </slot>
            <div class="h-px w-full mt-1 bg-color-black bg-opacity-30" />
        </div>
        <slot name='success-screen'></slot>
    </div>
{:else}
    <!-- Tabs container -->
    <div class="w-full flex items-center justify-between">
        <!-- Tabs -->
        <TabSwitcher bind:selectedTab={tab}><slot name='mid-tab-nav-content' slot='mid-tab-nav'></slot></TabSwitcher>
    </div>

    <!-- Horizontal Line -->
    <div class="h-px w-full mt-1 bg-color-black bg-opacity-30" />

    <!-- Selected Tab Content -->
    <div class="py-5 flex-grow overflow-hidden">
        <div class="w-full h-full flex flex-col">
            <div class="h-full flex flex-col justify-between">
                {#if tab == 0}
                    <slot name='first-tab'></slot>
                    <slot name='first-tab-footer'></slot>
                {:else if tab == 1}
                    <slot name='mid-tab'></slot>
                    <slot name='mid-tab-footer'></slot>
                {:else if tab == 2}
                    <slot name='last-tab'><CardHistoryTab></CardHistoryTab></slot>
                {/if}
            </div>
        </div>
    </div>
{/if}
