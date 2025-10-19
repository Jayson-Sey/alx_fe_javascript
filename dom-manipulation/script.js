 let quotes = JSON.parse(localStorage.getItem('quotes')) || [
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
            // Load last viewed quote from session storage
            const lastQuote = sessionStorage.getItem('lastQuote');
            if (lastQuote) {
                const quote = JSON.parse(lastQuote);
                document.getElementById('quoteDisplay').innerHTML = `
                    <p class="quote-text">"${quote.text}"</p>
                    <span class="quote-category">${quote.category}</span>
                `;
            } else {
                showRandomQuote();
            }
            
            createAddQuoteForm();
            updateCategoryButtons();
            displayQuotesList();
            updateStats();
            
            // Add event listener for the "Show New Quote" button
            document.getElementById('newQuote').addEventListener('click', showRandomQuote);
            
            // Add event listener for export button
            document.getElementById('exportJson').addEventListener('click', exportToJson);
            
            // Add event listener for import file input
            document.getElementById('importFile').addEventListener('change', importFromJsonFile);
        });

        // Function to save quotes to local storage
        function saveQuotes() {
            localStorage.setItem('quotes', JSON.stringify(quotes));
        }

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
            
            // Save last viewed quote to session storage
            sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
        }

        // Function to create the add quote form dynamically
        function createAddQuoteForm() {
            // Check if form already exists
            if (document.getElementById('addQuoteForm')) {
                return;
            }
            
            // Create form container
            const formContainer = document.createElement('div');
            formContainer.id = 'addQuoteForm';
            formContainer.style.marginTop = '20px';
            formContainer.style.padding = '20px';
            formContainer.style.border = '1px solid #ddd';
            formContainer.style.borderRadius = '8px';
            formContainer.style.backgroundColor = '#f9f9f9';
            
            // Create form title
            const formTitle = document.createElement('h3');
            formTitle.textContent = 'Add New Quote';
            formContainer.appendChild(formTitle);
            
            // Create quote text input
            const quoteTextGroup = document.createElement('div');
            quoteTextGroup.style.marginBottom = '15px';
            
            const quoteTextLabel = document.createElement('label');
            quoteTextLabel.textContent = 'Quote Text:';
            quoteTextLabel.style.display = 'block';
            quoteTextLabel.style.marginBottom = '5px';
            quoteTextLabel.style.fontWeight = 'bold';
            
            const quoteTextInput = document.createElement('textarea');
            quoteTextInput.id = 'newQuoteText';
            quoteTextInput.placeholder = 'Enter a new quote';
            quoteTextInput.style.width = '100%';
            quoteTextInput.style.padding = '8px';
            quoteTextInput.style.border = '1px solid #ccc';
            quoteTextInput.style.borderRadius = '4px';
            quoteTextInput.rows = 3;
            
            quoteTextGroup.appendChild(quoteTextLabel);
            quoteTextGroup.appendChild(quoteTextInput);
            formContainer.appendChild(quoteTextGroup);
            
            // Create category input
            const categoryGroup = document.createElement('div');
            categoryGroup.style.marginBottom = '15px';
            
            const categoryLabel = document.createElement('label');
            categoryLabel.textContent = 'Category:';
            categoryLabel.style.display = 'block';
            categoryLabel.style.marginBottom = '5px';
            categoryLabel.style.fontWeight = 'bold';
            
            const categoryInput = document.createElement('input');
            categoryInput.id = 'newQuoteCategory';
            categoryInput.type = 'text';
            categoryInput.placeholder = 'Enter quote category';
            categoryInput.style.width = '100%';
            categoryInput.style.padding = '8px';
            categoryInput.style.border = '1px solid #ccc';
            categoryInput.style.borderRadius = '4px';
            
            categoryGroup.appendChild(categoryLabel);
            categoryGroup.appendChild(categoryInput);
            formContainer.appendChild(categoryGroup);
            
            // Create add button
            const addButton = document.createElement('button');
            addButton.textContent = 'Add Quote';
            addButton.style.padding = '10px 20px';
            addButton.style.backgroundColor = '#4CAF50';
            addButton.style.color = 'white';
            addButton.style.border = 'none';
            addButton.style.borderRadius = '4px';
            addButton.style.cursor = 'pointer';
            addButton.addEventListener('click', addQuote);
            
            formContainer.appendChild(addButton);
            
            // Insert the form after the quote display
            const quoteDisplay = document.getElementById('quoteDisplay');
            quoteDisplay.parentNode.insertBefore(formContainer, quoteDisplay.nextSibling);
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
            
            // Save to local storage
            saveQuotes();
            
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
            // Check if category selector exists, if not create it
            let categorySelector = document.getElementById('categorySelector');
            
            if (!categorySelector) {
                categorySelector = document.createElement('div');
                categorySelector.id = 'categorySelector';
                categorySelector.style.marginBottom = '20px';
                categorySelector.style.display = 'flex';
                categorySelector.style.gap = '10px';
                categorySelector.style.flexWrap = 'wrap';
                
                // Insert before quote display
                const quoteDisplay = document.getElementById('quoteDisplay');
                quoteDisplay.parentNode.insertBefore(categorySelector, quoteDisplay);
            } else {
                // Clear existing buttons except "All Categories"
                const allBtn = categorySelector.querySelector('[data-category="all"]');
                categorySelector.innerHTML = '';
                if (allBtn) {
                    categorySelector.appendChild(allBtn);
                }
            }
            
            // Create "All Categories" button if it doesn't exist
            if (!categorySelector.querySelector('[data-category="all"]')) {
                const allButton = document.createElement('button');
                allButton.className = 'category-btn';
                allButton.classList.add('active');
                allButton.setAttribute('data-category', 'all');
                allButton.textContent = 'All Categories';
                allButton.style.padding = '8px 16px';
                allButton.style.border = '1px solid #ccc';
                allButton.style.borderRadius = '4px';
                allButton.style.cursor = 'pointer';
                allButton.style.backgroundColor = '#4CAF50';
                allButton.style.color = 'white';
                
                allButton.addEventListener('click', function() {
                    // Update active button
                    document.querySelectorAll('.category-btn').forEach(btn => {
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    });
                    this.style.backgroundColor = '#4CAF50';
                    this.style.color = 'white';
                    
                    // Update current category and show a quote
                    currentCategory = this.getAttribute('data-category');
                    showRandomQuote();
                });
                
                categorySelector.appendChild(allButton);
            }
            
            // Get all unique categories
            const categories = [...new Set(quotes.map(quote => quote.category))];
            
            // Add category buttons
            categories.forEach(category => {
                const button = document.createElement('button');
                button.className = 'category-btn';
                button.setAttribute('data-category', category);
                button.textContent = category;
                button.style.padding = '8px 16px';
                button.style.border = '1px solid #ccc';
                button.style.borderRadius = '4px';
                button.style.cursor = 'pointer';
                
                if (category === currentCategory) {
                    button.style.backgroundColor = '#4CAF50';
                    button.style.color = 'white';
                }
                
                button.addEventListener('click', function() {
                    // Update active button
                    document.querySelectorAll('.category-btn').forEach(btn => {
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    });
                    this.style.backgroundColor = '#4CAF50';
                    this.style.color = 'white';
                    
                    // Update current category and show a quote
                    currentCategory = this.getAttribute('data-category');
                    showRandomQuote();
                });
                
                categorySelector.appendChild(button);
            });
        }

        // Function to display the list of all quotes
        function displayQuotesList() {
            // Check if quotes list exists, if not create it
            let quotesList = document.getElementById('quotesList');
            
            if (!quotesList) {
                const quotesListContainer = document.createElement('div');
                quotesListContainer.style.marginTop = '30px';
                
                const quotesListTitle = document.createElement('h3');
                quotesListTitle.textContent = 'All Quotes';
                quotesListContainer.appendChild(quotesListTitle);
                
                quotesList = document.createElement('div');
                quotesList.id = 'quotesList';
                quotesListContainer.appendChild(quotesList);
                
                // Insert after the add quote form
                const addQuoteForm = document.getElementById('addQuoteForm');
                addQuoteForm.parentNode.insertBefore(quotesListContainer, addQuoteForm.nextSibling);
            } else {
                quotesList.innerHTML = '';
            }
            
            if (quotes.length === 0) {
                quotesList.innerHTML = '<p>No quotes available. Add some quotes to get started!</p>';
                return;
            }
            
            quotes.forEach((quote, index) => {
                const quoteItem = document.createElement('div');
                quoteItem.style.padding = '10px';
                quoteItem.style.marginBottom = '10px';
                quoteItem.style.border = '1px solid #ddd';
                quoteItem.style.borderRadius = '4px';
                quoteItem.style.display = 'flex';
                quoteItem.style.justifyContent = 'space-between';
                quoteItem.style.alignItems = 'center';
                
                const quoteText = document.createElement('span');
                quoteText.textContent = `"${quote.text}" - ${quote.category}`;
                quoteText.style.fontStyle = 'italic';
                
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.style.padding = '5px 10px';
                deleteButton.style.backgroundColor = '#f44336';
                deleteButton.style.color = 'white';
                deleteButton.style.border = 'none';
                deleteButton.style.borderRadius = '4px';
                deleteButton.style.cursor = 'pointer';
                deleteButton.addEventListener('click', function() {
                    deleteQuote(index);
                });
                
                quoteItem.appendChild(quoteText);
                quoteItem.appendChild(deleteButton);
                quotesList.appendChild(quoteItem);
            });
        }

        // Function to delete a quote
        function deleteQuote(index) {
            if (confirm('Are you sure you want to delete this quote?')) {
                quotes.splice(index, 1);
                saveQuotes();
                displayQuotesList();
                updateCategoryButtons();
                updateStats();
                
                // If we deleted the currently displayed quote, show a new one
                showRandomQuote();
            }
        }

        // Function to update statistics
        function updateStats() {
            // Check if stats container exists, if not create it
            let statsContainer = document.getElementById('statsContainer');
            
            if (!statsContainer) {
                statsContainer = document.createElement('div');
                statsContainer.id = 'statsContainer';
                statsContainer.style.marginTop = '20px';
                statsContainer.style.padding = '15px';
                statsContainer.style.borderTop = '1px solid #ddd';
                statsContainer.style.display = 'flex';
                statsContainer.style.justifyContent = 'space-around';
                
                // Insert after quotes list
                const quotesListContainer = document.querySelector('#quotesList').parentNode;
                quotesListContainer.parentNode.insertBefore(statsContainer, quotesListContainer.nextSibling);
            } else {
                statsContainer.innerHTML = '';
            }
            
            const totalQuotes = document.createElement('div');
            totalQuotes.style.textAlign = 'center';
            
            const totalQuotesValue = document.createElement('div');
            totalQuotesValue.id = 'totalQuotes';
            totalQuotesValue.textContent = quotes.length;
            totalQuotesValue.style.fontSize = '24px';
            totalQuotesValue.style.fontWeight = 'bold';
            totalQuotesValue.style.color = '#4CAF50';
            
            const totalQuotesLabel = document.createElement('div');
            totalQuotesLabel.textContent = 'Total Quotes';
            totalQuotesLabel.style.fontSize = '14px';
            totalQuotesLabel.style.color = '#666';
            
            totalQuotes.appendChild(totalQuotesValue);
            totalQuotes.appendChild(totalQuotesLabel);
            
            const totalCategories = document.createElement('div');
            totalCategories.style.textAlign = 'center';
            
            const totalCategoriesValue = document.createElement('div');
            totalCategoriesValue.id = 'totalCategories';
            totalCategoriesValue.textContent = new Set(quotes.map(quote => quote.category)).size;
            totalCategoriesValue.style.fontSize = '24px';
            totalCategoriesValue.style.fontWeight = 'bold';
            totalCategoriesValue.style.color = '#2196F3';
            
            const totalCategoriesLabel = document.createElement('div');
            totalCategoriesLabel.textContent = 'Categories';
            totalCategoriesLabel.style.fontSize = '14px';
            totalCategoriesLabel.style.color = '#666';
            
            totalCategories.appendChild(totalCategoriesValue);
            totalCategories.appendChild(totalCategoriesLabel);
            
            statsContainer.appendChild(totalQuotes);
            statsContainer.appendChild(totalCategories);
        }

        // Function to export quotes to JSON
        function exportToJson() {
            const dataStr = JSON.stringify(quotes, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'quotes.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            alert('Quotes exported successfully!');
        }

        // Function to import quotes from JSON file
        function importFromJsonFile(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const fileReader = new FileReader();
            fileReader.onload = function(e) {
                try {
                    const importedQuotes = JSON.parse(e.target.result);
                    
                    if (!Array.isArray(importedQuotes)) {
                        throw new Error('Invalid JSON format. Expected an array of quotes.');
                    }
                    
                    // Validate each quote object
                    for (let quote of importedQuotes) {
                        if (!quote.text || !quote.category) {
                            throw new Error('Invalid quote format. Each quote must have text and category.');
                        }
                    }
                    
                    // Add imported quotes to the existing quotes
                    quotes.push(...importedQuotes);
                    saveQuotes();
                    
                    // Update UI
                    updateCategoryButtons();
                    displayQuotesList();
                    updateStats();
                    
                    // Reset file input
                    event.target.value = '';
                    
                    alert('Quotes imported successfully!');
                } catch (error) {
                    alert('Error importing quotes: ' + error.message);
                }
            };
            fileReader.readAsText(file);
        }
