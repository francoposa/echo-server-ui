const FixedTextArea = ({ rows, cols, value, onChange }) => {
    return (
        <textarea
            rows={rows}
            cols={cols}
            className="resize-none w-3/4 h-72 rounded border border-stone-200"
            value={value}
            onChange={onChange}
        />
    );
};

export default FixedTextArea;
