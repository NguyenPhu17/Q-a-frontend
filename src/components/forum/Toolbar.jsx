import React from 'react';
import {
    FaBold, FaItalic, FaUnderline, FaListUl, FaLink, FaCode,
    FaAlignLeft, FaAlignCenter, FaAlignRight
} from 'react-icons/fa';

export default function Toolbar({ insertAtCursor, insertListAtCursor, insertAlignAtCursor }) {
    return (
        <div className="flex gap-2 mb-2 flex-wrap">
            <button type="button" onClick={() => insertAtCursor('**', '**')} title="Chữ đậm" className="px-3 py-1 border rounded font-bold hover:bg-gray-100"><FaBold size={14} /></button>
            <button type="button" onClick={() => insertAtCursor('*', '*')} title="Chữ nghiêng" className="px-3 py-1 border rounded italic hover:bg-gray-100"><FaItalic size={14} /></button>
            <button type="button" onClick={() => insertAtCursor('<u>', '</u>')} title="Gạch chân" className="px-3 py-1 border rounded hover:bg-gray-100"><FaUnderline size={14} /></button>
            <button type="button" onClick={insertListAtCursor} title="Danh sách" className="px-3 py-1 border rounded hover:bg-gray-100"><FaListUl size={14} /></button>
            <button type="button" onClick={() => insertAtCursor('[', '](https://)')} title="Chèn link" className="px-3 py-1 border rounded hover:bg-gray-100"><FaLink size={14} /></button>
            <button type="button" onClick={() => insertAtCursor('`', '`')} title="Code" className="px-3 py-1 border rounded font-mono hover:bg-gray-100"><FaCode size={14} /></button>
            <button type="button" onClick={() => insertAlignAtCursor('left')} title="Căn trái" className="border rounded hover:bg-gray-100"><FaAlignLeft size={16} /></button>
            <button type="button" onClick={() => insertAlignAtCursor('center')} title="Căn giữa" className="border rounded hover:bg-gray-100"><FaAlignCenter size={16} /></button>
            <button type="button" onClick={() => insertAlignAtCursor('right')} title="Căn phải" className="border rounded hover:bg-gray-100"><FaAlignRight size={16} /></button>
        </div>
    );
}
