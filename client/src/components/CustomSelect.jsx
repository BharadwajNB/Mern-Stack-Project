import { useState, useRef, useEffect } from 'react';

const CustomSelect = ({
    value,
    onChange,
    options,
    name,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    };

    const selectedOption = options.find(opt =>
        (typeof opt === 'object' ? opt.value : opt) === value
    );
    const displayValue = typeof selectedOption === 'object'
        ? selectedOption.label
        : selectedOption || value;

    return (
        <div className={`custom-select ${className}`} ref={dropdownRef}>
            <button
                type="button"
                className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="select-value">{displayValue}</span>
                <span className={`select-arrow ${isOpen ? 'open' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div className="custom-select-dropdown">
                    {options.map((option, index) => {
                        const optValue = typeof option === 'object' ? option.value : option;
                        const optLabel = typeof option === 'object' ? option.label : option;
                        const isSelected = optValue === value;

                        return (
                            <div
                                key={index}
                                className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleSelect(optValue)}
                            >
                                {optLabel}
                                {isSelected && (
                                    <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
                .custom-select {
                    position: relative;
                    width: 100%;
                }

                .custom-select-trigger {
                    width: 100%;
                    padding: 16px 20px;
                    font-family: var(--font-main);
                    font-size: 16px;
                    background: var(--bg-elevated);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius-md);
                    color: var(--text-main);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: all 0.2s ease;
                    text-align: left;
                }

                .custom-select-trigger:hover {
                    border-color: var(--accent);
                    background: var(--bg-card);
                }

                .custom-select-trigger.open {
                    border-color: var(--accent);
                    background: var(--bg-card);
                    box-shadow: 0 0 0 4px var(--accent-light);
                }

                .select-value {
                    font-weight: 500;
                }

                .select-arrow {
                    color: var(--text-muted);
                    transition: transform 0.25s ease, color 0.2s ease;
                    display: flex;
                    align-items: center;
                }

                .select-arrow.open {
                    transform: rotate(180deg);
                    color: var(--accent);
                }

                .custom-select-dropdown {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    right: 0;
                    background: var(--bg-card);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-popup);
                    z-index: 1000;
                    overflow: hidden;
                    animation: dropdownSlide 0.2s ease;
                }

                @keyframes dropdownSlide {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .custom-select-option {
                    padding: 14px 20px;
                    font-size: 15px;
                    font-weight: 500;
                    color: var(--text-main);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: all 0.15s ease;
                }

                .custom-select-option:hover {
                    background: var(--bg-elevated);
                }

                .custom-select-option.selected {
                    background: var(--accent-light);
                    color: var(--accent);
                }

                .custom-select-option.selected:hover {
                    background: var(--accent-light);
                }

                .check-icon {
                    color: var(--accent);
                }

                .custom-select-option:not(:last-child) {
                    border-bottom: 1px solid var(--border-color);
                }
            `}</style>
        </div>
    );
};

export default CustomSelect;
