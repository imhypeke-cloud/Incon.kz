import React, { useState } from 'react';
import { Upload, FileText, ArrowRight, Loader2 } from 'lucide-react';

interface DataInputProps {
  onDataSubmit: (text: string) => void;
  isLoading: boolean;
}

const DataInput: React.FC<DataInputProps> = ({ onDataSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onDataSubmit(text);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-orange-500" />
        Загрузка Данных (Data Input)
      </h2>
      
      <p className="text-slate-500 mb-4 text-sm">
        Загрузите CSV/текстовый файл или вставьте список рабочих ниже для анализа ИИ.
        <br />
        <span className="text-xs text-slate-400">Пример: "Иванов - Сварщик - Сектор А, Петров - Электрик - Больничный..."</span>
      </p>

      <div className="relative mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-slate-700 text-sm"
          placeholder="Вставьте список рабочих здесь..."
        />
        <div className="absolute bottom-3 right-3">
            <label className="cursor-pointer bg-white p-2 rounded-md shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 text-xs font-medium text-slate-600">
                <FileText className="w-4 h-4" />
                Выбрать файл
                <input type="file" accept=".txt,.csv,.json" onChange={handleFileChange} className="hidden" />
            </label>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || !text.trim()}
        className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
          isLoading || !text.trim()
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/30'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Анализ данных...
          </>
        ) : (
          <>
            Сформировать отчет
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};

export default DataInput;
