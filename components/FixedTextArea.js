const FixedTextArea = ({ id, rows, cols, value, onChange, readOnly = false }) => {
    return (
        <textarea
            id={id}
            rows={rows}
            cols={cols}
            className="resize-none w-5/6 h-72 rounded border border-stone-200"
            value={value}
            onChange={onChange}
            readOnly={readOnly}
        />
    );
};

export default FixedTextArea;
