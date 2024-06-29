const OptionButton = ({ isSelected, getContent, content }) => {
    return (
        <div
            onClick={getContent}
            className={`option-button d-inline-block text-center border-radius ${isSelected ? 'focus' : ''}`}
        >
            <span>{content}</span>
        </div>
    );
};

export default OptionButton;
