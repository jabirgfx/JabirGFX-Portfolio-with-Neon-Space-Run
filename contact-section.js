const state = {
            status: "CONTACT ME",
            head1: "IDEAS INTO",
            head2: "VISUALS.",
            desc: "Have a project in mind or looking for a creative designer? Let's turn your idea into a clean, impactful visual experience.",
            email: "jabirgfx.shanto@gmail.com",
            whatsapp: "+880 1700-000000",
            messenger: "m.me/jabirgfx",
            service: "Brand Identity"
        };

        function selectServicePill(serviceName, btnEl) {
            state.service = serviceName;
            document.getElementById('input-service').value = serviceName;
            
            document.querySelectorAll('.tag-pill').forEach(pill => pill.classList.remove('active'));
            btnEl.classList.add('active');
        }

        function copyEmailToClipboard() {
            const textarea = document.createElement('textarea');
            textarea.value = state.email;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            showToast(`Copied ${state.email} to clipboard!`);
        }

        function handleFormSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('input-name').value;
            const service = state.service || "Project Inquiry";
            
            showToast(`🚀 Inquiry sent by ${name} (${service})!`);
            e.target.reset();
        }

        function showToast(msg) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = "toast-slide bg-[#0a1226] border border-cyan-500/40 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 pointer-events-auto";
            toast.innerHTML = `<svg class="w-4 h-4 fill-cyan-400 shrink-0" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> <span class="font-medium text-slate-200">${msg}</span>`;
            
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3200);
        }
