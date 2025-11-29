import React, { useState } from 'react';
import { 
  HardHat, Users, Hammer, AlertTriangle, CheckCircle2, 
  MapPin, Activity, FileBarChart, BrainCircuit, PenSquare, Save, Printer, Briefcase
} from 'lucide-react';
import DataInput from './components/DataInput';
import StatsCard from './components/StatsCard';
import { RoleDistributionChart, StatusPieChart, LocationDistributionChart, CategoryPieChart } from './components/WorkerCharts';
import { parseAndAnalyzeData } from './services/geminiService';
import { DashboardData, WorkerRole, WorkStatus, WorkerData, WorkerCategory } from './types';

// Mock data reflecting the document structure roughly
const INITIAL_DATA: DashboardData = {
  workers: [
    // ITR
    { id: '1', name: 'Исполнительный директор', role: 'Директор', category: 'ITR', location: 'Офис', status: WorkStatus.ACTIVE, efficiency: 100 },
    { id: '2', name: 'Технический директор', role: 'Директор', category: 'ITR', location: 'Офис', status: WorkStatus.ACTIVE, efficiency: 100 },
    { id: '3', name: 'Начальник ОКК', role: 'Начальник', category: 'ITR', location: 'Офис', status: WorkStatus.ACTIVE, efficiency: 95 },
    { id: '4', name: 'Инженер ПТО 1', role: 'Инженер', category: 'ITR', location: 'Офис', status: WorkStatus.ACTIVE, efficiency: 90 },
    { id: '5', name: 'Геодезист 1', role: 'Геодезист', category: 'ITR', location: 'Площадка', status: WorkStatus.ACTIVE, efficiency: 88 },
    { id: '6', name: 'Геодезист 2', role: 'Геодезист', category: 'ITR', location: 'Площадка', status: WorkStatus.ACTIVE, efficiency: 88 },
    // Workers
    { id: '10', name: 'Рабочий 1', role: 'Электромонтажник', category: 'WORKER', location: 'Титул 1.1', status: WorkStatus.ACTIVE, efficiency: 85 },
    { id: '11', name: 'Рабочий 2', role: 'Электромонтажник', category: 'WORKER', location: 'Титул 1.1', status: WorkStatus.ACTIVE, efficiency: 85 },
    { id: '12', name: 'Рабочий 3', role: 'Арматурщик', category: 'WORKER', location: 'Титул 25', status: WorkStatus.ACTIVE, efficiency: 80 },
    { id: '13', name: 'Рабочий 4', role: 'Арматурщик', category: 'WORKER', location: 'Титул 25', status: WorkStatus.ACTIVE, efficiency: 80 },
    { id: '14', name: 'Рабочий 5', role: 'Арматурщик', category: 'WORKER', location: 'Титул 25', status: WorkStatus.ACTIVE, efficiency: 80 },
    { id: '15', name: 'Рабочий 6', role: 'Бетонщик', category: 'WORKER', location: 'Титул 30', status: WorkStatus.ACTIVE, efficiency: 75 },
    { id: '16', name: 'Рабочий 7', role: 'Разнорабочий', category: 'WORKER', location: 'Склад', status: WorkStatus.SICK, efficiency: 0 },
  ],
  summary: "Общий штат укомплектован согласно плану. Наблюдается высокая активность на Титуле 25 (монтаж арматуры). Требуется контроль за поставкой материалов на Титул 1.1.",
  alerts: ["1 сотрудник на больничном (Склад)", "Необходимо усилить бригаду геодезистов"],
  recommendations: ["Провести инструктаж по ТБ на Титуле 25", "Утвердить график отпусков для ИТР состава"]
};

const App: React.FC = () => {
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleDataSubmit = async (inputText: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await parseAndAnalyzeData(inputText);
      setData(result);
    } catch (err) {
      setError("Не удалось обработать данные. Пожалуйста, проверьте формат или API ключ.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerUpdate = (index: number, field: keyof WorkerData, value: string | number) => {
    const updatedWorkers = [...data.workers];
    updatedWorkers[index] = { ...updatedWorkers[index], [field]: value };
    setData({ ...data, workers: updatedWorkers });
  };

  const handlePrint = () => {
    window.print();
  };

  // derived stats
  const totalPeople = data.workers.filter(w => w.category !== 'MACHINERY').length;
  const itrCount = data.workers.filter(w => w.category === 'ITR').length;
  const workerCount = data.workers.filter(w => w.category === 'WORKER').length;
  const machineryCount = data.workers.filter(w => w.category === 'MACHINERY').length;
  
  // Dynamics (Mock - pretending yesterday was 5% less active)
  const activeNow = data.workers.filter(w => w.status.includes('Active') || w.status.includes('На смене')).length;
  const previousActive = Math.round(activeNow * 0.95);
  const dynamics = activeNow - previousActive;

  return (
    <div className="min-h-screen bg-slate-100 pb-20 print:bg-white print:pb-0">
      {/* Header - Hidden on Print if desired, or styled differently */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-30 print:relative print:bg-white print:text-black print:shadow-none print:border-b-2 print:border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg print:hidden">
              <HardHat className="text-white w-6 h-6" />
            </div>
            <div>
               <h1 className="text-xl font-bold tracking-tight">INTEGRA CONSTRUCTION KZ</h1>
               <p className="text-xs text-slate-400 print:text-slate-600">Система мониторинга трудовых ресурсов</p>
            </div>
          </div>
          <div className="flex items-center gap-4 print:hidden">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${isEditing ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <PenSquare className="w-4 h-4" />}
              {isEditing ? 'Сохранить' : 'Корректировать'}
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-md hover:bg-slate-700 text-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              Печать
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Report Header for Print */}
        <div className="hidden print:block mb-8 text-center border-b pb-4">
            <h2 className="text-2xl font-bold uppercase">Справка о расстановке трудовых ресурсов</h2>
            <p className="text-sm text-slate-600">Дата формирования: {new Date().toLocaleDateString()}</p>
        </div>

        {error && (
           <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 print:hidden">
             <AlertTriangle className="w-5 h-5" />
             {error}
           </div>
        )}

        {/* Input Section - Hidden on Print */}
        <div className="mb-8 print:hidden">
           <DataInput onDataSubmit={handleDataSubmit} isLoading={loading} />
        </div>

        {/* Executive Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-indigo-600 p-6 mb-8 print:shadow-none print:border">
           <div className="flex items-start justify-between">
              <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    Оперативная Сводка (Executive Summary)
                  </h3>
                  <p className="text-slate-600 leading-relaxed max-w-4xl">
                    {data.summary}
                  </p>
              </div>
              {/* Dynamic Badge */}
              <div className="hidden sm:flex flex-col items-end">
                 <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    Динамика: +{dynamics} чел.
                 </div>
                 <span className="text-xs text-slate-400 mt-1">к предыдущей смене</span>
              </div>
           </div>
           
           {/* Alerts & Recs */}
           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.alerts.length > 0 && (
                <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                    <h4 className="text-xs font-bold text-red-700 uppercase mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Критические замечания
                    </h4>
                    <ul className="text-sm text-red-800 space-y-1 pl-4 list-disc">
                        {data.alerts.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                </div>
              )}
              {data.recommendations.length > 0 && (
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                    <h4 className="text-xs font-bold text-emerald-700 uppercase mb-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Рекомендации
                    </h4>
                    <ul className="text-sm text-emerald-800 space-y-1 pl-4 list-disc">
                        {data.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                </div>
              )}
           </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <StatsCard 
             title="Весь персонал" 
             value={totalPeople} 
             icon={<Users className="w-6 h-6" />} 
             color="slate"
             trend="+5%"
             trendUp={true}
           />
           <StatsCard 
             title="ИТР Состав" 
             value={itrCount} 
             icon={<Briefcase className="w-6 h-6" />} 
             color="blue"
           />
           <StatsCard 
             title="Рабочие" 
             value={workerCount} 
             icon={<HardHat className="w-6 h-6" />} 
             color="orange"
           />
           <StatsCard 
             title="Спецтехника" 
             value={machineryCount} 
             icon={<Hammer className="w-6 h-6" />} 
             color="slate"
           />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 print:break-inside-avoid">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 lg:col-span-1">
                <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" /> Состав ИТР / Рабочие
                </h3>
                <CategoryPieChart data={data.workers} />
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
                <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> Распределение по Титулам (Объектам)
                </h3>
                <LocationDistributionChart data={data.workers} />
            </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-8 print:break-inside-avoid">
             <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <FileBarChart className="w-4 h-4 text-slate-400" /> Детализация по Должностям
             </h3>
             <RoleDistributionChart data={data.workers} />
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center print:bg-white print:border-b-2 print:border-black">
            <h3 className="font-bold text-slate-800">Ведомость расстановки (Roster)</h3>
            {isEditing && <span className="text-xs text-orange-600 font-medium animate-pulse">Режим редактирования активен</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs print:bg-white print:text-black print:border-b">
                <tr>
                  <th className="px-6 py-3">Категория</th>
                  <th className="px-6 py-3">Должность / Роль</th>
                  <th className="px-6 py-3">Имя / ID</th>
                  <th className="px-6 py-3">Объект (Титул)</th>
                  <th className="px-6 py-3">Статус</th>
                  <th className="px-6 py-3 text-right">Эфф.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                {data.workers.map((worker, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    {/* Category */}
                    <td className="px-6 py-3">
                       {isEditing ? (
                         <select 
                            value={worker.category}
                            onChange={(e) => handleWorkerUpdate(i, 'category', e.target.value)}
                            className="bg-white border rounded px-2 py-1 text-xs"
                         >
                            <option value="ITR">ИТР</option>
                            <option value="WORKER">Рабочий</option>
                            <option value="MACHINERY">Техника</option>
                         </select>
                       ) : (
                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            worker.category === 'ITR' ? 'bg-indigo-100 text-indigo-700' :
                            worker.category === 'WORKER' ? 'bg-orange-100 text-orange-700' :
                            'bg-slate-200 text-slate-600'
                         }`}>
                           {worker.category}
                         </span>
                       )}
                    </td>
                    
                    {/* Role */}
                    <td className="px-6 py-3 font-medium text-slate-800">
                       {isEditing ? (
                         <input 
                           type="text" 
                           value={worker.role} 
                           onChange={(e) => handleWorkerUpdate(i, 'role', e.target.value)}
                           className="border rounded px-2 py-1 w-full"
                         />
                       ) : worker.role}
                    </td>

                    {/* Name */}
                    <td className="px-6 py-3 text-slate-600">
                       {isEditing ? (
                         <input 
                           type="text" 
                           value={worker.name} 
                           onChange={(e) => handleWorkerUpdate(i, 'name', e.target.value)}
                           className="border rounded px-2 py-1 w-full"
                         />
                       ) : worker.name}
                    </td>

                    {/* Location */}
                    <td className="px-6 py-3 text-slate-600">
                       {isEditing ? (
                         <input 
                           type="text" 
                           value={worker.location} 
                           onChange={(e) => handleWorkerUpdate(i, 'location', e.target.value)}
                           className="border rounded px-2 py-1 w-full"
                         />
                       ) : worker.location}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3">
                        {isEditing ? (
                             <select 
                                value={worker.status}
                                onChange={(e) => handleWorkerUpdate(i, 'status', e.target.value)}
                                className="bg-white border rounded px-2 py-1 text-xs"
                             >
                                <option value={WorkStatus.ACTIVE}>{WorkStatus.ACTIVE}</option>
                                <option value={WorkStatus.SICK}>{WorkStatus.SICK}</option>
                                <option value={WorkStatus.LEAVE}>{WorkStatus.LEAVE}</option>
                                <option value={WorkStatus.ABSENT}>{WorkStatus.ABSENT}</option>
                             </select>
                        ) : (
                            <span className={`inline-flex items-center gap-1.5 ${
                                ['На смене', 'Active', 'Работает'].some(s => worker.status.includes(s)) ? 'text-green-600' : 
                                ['Больничный', 'Отсутствует'].some(s => worker.status.includes(s)) ? 'text-red-500' : 
                                'text-amber-600'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                ['На смене', 'Active', 'Работает'].some(s => worker.status.includes(s)) ? 'bg-green-500' : 
                                ['Больничный', 'Отсутствует'].some(s => worker.status.includes(s)) ? 'bg-red-500' : 
                                'bg-amber-500'
                                }`}></span>
                                {worker.status}
                            </span>
                        )}
                    </td>
                    
                    {/* Efficiency */}
                    <td className="px-6 py-3 text-right text-slate-600">
                         {isEditing ? (
                             <input 
                               type="number" 
                               value={worker.efficiency} 
                               onChange={(e) => handleWorkerUpdate(i, 'efficiency', parseInt(e.target.value))}
                               className="border rounded px-2 py-1 w-16 text-right"
                             />
                           ) : (
                            <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: `${worker.efficiency}%` }}></div>
                                </div>
                                <span>{worker.efficiency}%</span>
                            </div>
                           )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;