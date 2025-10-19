// Initial quotes array
        let quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Motivation" },
            { text: "Life is what happens to you while you're busy making other plans.", category: "Life" },
            { text: "In the middle of difficulty lies opportunity.", category: "Wisdom" },
            { text: "It does not matter how slowly you go as long as you do not stop.", category: "Perseverance" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
            { text: "Be the change that you wish to see in the world.", category: "Inspiration" },
            { text: "The only true wisdom is in knowing you know nothing.", category: "Wisdom" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
        ];

        let currentCategory = "all";

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            showRandomQuote();
            updateCategoryButtons();
            displayQuotesList();
            updateStats();
            
            // Add event listener for the "Show New Quote" button
            document.getElementById('newQuote').addEventListener('click', showRandomQuote);
        });

        // Function to display a random quote
        function showRandomQuote() {
            const quoteDisplay = document.getElementById('quoteDisplay');
            
            // Filter quotes by category if needed
            let filteredQuotes = quotes;
            if (currentCategory !== "all") {
                filteredQuotes = quotes.filter(quote => quote.category === currentCategory);
            }
            
            if (filteredQuotes.length === 0) {
                quoteDisplay.innerHTML = `
                    <p class="quote-text">No quotes available in this category. Add some quotes!</p>
                    <span class="quote-category">Empty</span>
                `;
                return;
            }
            
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const randomQuote = filteredQuotes[randomIndex];
            
            quoteDisplay.innerHTML = `
                <p class="quote-text">"${randomQuote.text}"</p>
                <span class="quote-category">${randomQuote.category}</span>
            `;
            
            // Add animation effect
            quoteDisplay.style.transform = "scale(0.95)";
            setTimeout(() => {
                quoteDisplay.style.transform = "scale(1)";
            }, 150);
        }

        // Function to add a new quote
        function addQuote() {
            const quoteText = document.getElementById('newQuoteText').value.trim();
            const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
            
            if (!quoteText || !quoteCategory) {
                alert('Please enter both a quote and a category.');
                return;
            }
            
            // Add the new quote to the array
            quotes.push({
                text: quoteText,
                category: quoteCategory
            });
            
            // Clear the form
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
            
            // Update the UI
            updateCategoryButtons();
            displayQuotesList();
            updateStats();
            
            // Show confirmation
            alert('Quote added successfully!');
        }

        // Function to update category buttons
        function updateCategoryButtons() {
            const categorySelector = document.querySelector('.category-selector');
            
            // Get all unique categories
            const categories = ["all", ...new Set(quotes.map(quote => quote.category))];
            
            // Clear existing buttons except the first one (All Categories)
            const allBtn = categorySelector.querySelector('[data-category="all"]');
            categorySelector.innerHTML = '';
            categorySelector.appendChild(allBtn);
            
            // Add category buttons
            categories.forEach(category => {
                if (category === "all") return; // Skip "all" as we already have it
                
                const button = document.createElement('button');
                button.className = 'category-btn';
                if (category === currentCategory) {
                    button.classList.add('active');
                }
                button.setAttribute('data-category', category);
                button.textContent = category;
                button.addEventListener('click', function() {
                    // Update active button
                    document.querySelectorAll('.category-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // Update current category and show a quote
                    currentCategory = this.getAttribute('data-category');
                    showRandomQuote();
                });
                
                categorySelector.appendChild(button);
            });
        }

        // Function to display the list of all quotes
        function displayQuotesList() {
            const quotesList = document.getElementById('quotesList');
            quotesList.innerHTML = '';
            
            if (quotes.length === 0) {
                quotesList.innerHTML = '<p>No quotes available. Add some quotes to get started!</p>';
                return;
            }
            
            quotes.forEach((quote, index) => {
                const quoteItem = document.createElement('div');
                quoteItem.className = 'quote-item';
                quoteItem.innerHTML = `
                    <div class="quote-item-text">"${quote.text}"</div>
                    <div class="quote-item-category">${quote.category}</div>
                    <button class="delete-btn" onclick="deleteQuote(${index})">Delete</button>
                `;
                quotesList.appendChild(quoteItem);
            });
        }

        // Function to delete a quote
        function deleteQuote(index) {
            if (confirm('Are you sure you want to delete this quote?')) {
                quotes.splice(index, 1);
                displayQuotesList();
                updateCategoryButtons();
                updateStats();
                
                // If we deleted the currently displayed quote, show a new one
                showRandomQuote();
            }
        }

        // Function to update statistics
        function updateStats() {
            document.getElementById('totalQuotes').textContent = quotes.length;
            document.getElementById('totalCategories').textContent = new Set(quotes.map(quote => quote.category)).size;
        }
