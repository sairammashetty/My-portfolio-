
import React, { useState, useEffect } from 'react';
import { personalInfo as defaultPersonalInfo, educationData as defaultEducationData, experienceData as defaultExperienceData, skillsData as defaultSkillsData, awardsData as defaultAwardsData, articlesData as defaultArticlesData, projectsData as defaultProjectsData, certificationsData as defaultCertificationsData, sections as defaultSections } from '../constants';
import { ExperienceItem, SkillItem, AwardItem, ArticleItem, ProjectItem, CertificationItem, SectionConfig } from '../types';

type DataKeys = 'personalInfo' | 'educationData' | 'experienceData' | 'skillsData' | 'awardsData' | 'articlesData' | 'projectsData' | 'certificationsData' | 'sectionsConfig';

const Admin: React.FC = () => {
    // --- AUTHENTICATION ---
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Invalid password');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setPassword('');
        window.location.hash = ''; // Go back to portfolio view
    };

    // --- DATA MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('sections');
    const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);
    const [educationData, setEducationData] = useState(defaultEducationData);
    const [experienceData, setExperienceData] = useState<ExperienceItem[]>(defaultExperienceData);
    const [skillsData, setSkillsData] = useState<SkillItem[]>(defaultSkillsData);
    const [awardsData, setAwardsData] = useState<AwardItem[]>(defaultAwardsData);
    const [articlesData, setArticlesData] = useState<ArticleItem[]>(defaultArticlesData);
    const [projectsData, setProjectsData] = useState<ProjectItem[]>(defaultProjectsData);
    const [certificationsData, setCertificationsData] = useState<CertificationItem[]>(defaultCertificationsData);
    const [sections, setSections] = useState<SectionConfig[]>(defaultSections);


    useEffect(() => {
        // Load all data from localStorage on component mount
        const dataMap = {
            personalInfo: setPersonalInfo,
            educationData: setEducationData,
            experienceData: setExperienceData,
            skillsData: setSkillsData,
            awardsData: setAwardsData,
            articlesData: setArticlesData,
            projectsData: setProjectsData,
            certificationsData: setCertificationsData,
            sectionsConfig: setSections,
        };

        Object.keys(dataMap).forEach(key => {
            try {
                const savedData = localStorage.getItem(key);
                if (savedData) {
                    dataMap[key as DataKeys](JSON.parse(savedData));
                }
            } catch (e) {
                console.error(`Failed to load ${key} from localStorage`, e);
            }
        });
    }, []);

    const saveData = (key: DataKeys, data: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            alert(`${key.replace('Data', '').replace('Config','')} saved successfully!`);
            // Dispatch a custom event to notify the App component of changes
            if (key === 'sectionsConfig') {
                window.dispatchEvent(new CustomEvent('sectionsUpdated'));
            }
        } catch (e) {
            console.error(`Failed to save ${key} to localStorage`, e);
            alert(`Error saving ${key}.`);
        }
    };

    const handleSaveCurrentTab = () => {
        switch(activeTab) {
            case 'experience': saveData('experienceData', experienceData); break;
            case 'skills': saveData('skillsData', skillsData); break;
            case 'awards': saveData('awardsData', awardsData); break;
            case 'projects': saveData('projectsData', projectsData); break;
            case 'certifications': saveData('certificationsData', certificationsData); break;
            case 'articles': saveData('articlesData', articlesData); break;
        }
    };

    const handleItemChange = (setter: Function, index: number, field: string, value: any, isDescription: boolean = false) => {
        setter((prev: any[]) => {
            const newList = [...prev];
            const currentItem = { ...newList[index] };
            if (isDescription) {
                 currentItem[field] = value.split('\n');
            } else {
                currentItem[field] = value;
            }
            newList[index] = currentItem;
            return newList;
        });
    };

    const handleAddItem = (setter: Function, newItem: any) => {
        setter((prev: any[]) => [...prev, newItem]);
    };

    const handleRemoveItem = (setter: Function, index: number) => {
        setter((prev: any[]) => prev.filter((_, i) => i !== index));
    };

    const renderInput = (label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type: string = "text", placeholder: string = "") => (
        <div className="mb-4">
            <label className="block text-slate-300 text-sm font-bold mb-2">{label}</label>
            <input 
                type={type} 
                value={value} 
                onChange={onChange} 
                className="shadow appearance-none border rounded w-full py-2 px-3 bg-slate-700 border-slate-600 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-cyan-500 transition-colors"
                placeholder={placeholder}
            />
        </div>
    );
    
    const renderTextarea = (label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void) => (
        <div className="mb-4">
            <label className="block text-slate-300 text-sm font-bold mb-2">{label}</label>
            <textarea value={value} onChange={onChange} rows={5} className="shadow appearance-none border rounded w-full py-2 px-3 bg-slate-700 border-slate-600 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-cyan-500 min-h-[120px] transition-colors"/>
        </div>
    );


    // --- RENDER LOGIC ---
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="max-w-sm w-full bg-slate-800 p-8 rounded-2xl shadow-2xl shadow-black/30 border border-slate-700">
                    <h2 className="text-3xl font-bold text-center text-white mb-8">Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-6">
                            <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="password">Password</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 bg-slate-700 border-slate-600 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-cyan-500"
                                id="password" type="password" placeholder="************"
                                value={password} onChange={(e) => setPassword(e.target.value)} required
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                        <button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:bg-gradient-to-l text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-all duration-300" type="submit">Sign In</button>
                    </form>
                </div>
            </div>
        );
    }
    
    const tabs = [
      { id: 'sections', label: 'Manage Sections' },
      { id: 'personal', label: 'Personal Info' },
      { id: 'experience', label: 'Experience' },
      { id: 'skills', label: 'Skills' },
      { id: 'awards', label: 'Awards' },
      { id: 'projects', label: 'Projects' },
      { id: 'certifications', label: 'Certifications' },
      { id: 'articles', label: 'Articles' },
    ];


    return (
        <div className="min-h-screen bg-slate-900 text-white flex">
            <aside className="w-64 bg-slate-800 p-4 border-r border-slate-700 flex flex-col fixed h-full overflow-y-auto z-50">
                <h1 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-500 text-gradient">Admin Panel</h1>
                <nav className="flex flex-col space-y-2">
                    {tabs.map(tab => (
                         <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)} 
                            className={`p-2 rounded-md text-left transition-colors ${activeTab === tab.id ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-slate-700'}`}
                         >
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <div className="mt-auto pt-8">
                     <button onClick={() => window.location.hash = ''} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded mb-2 transition-colors">View Portfolio</button>
                    <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">Logout</button>
                </div>
            </aside>
            <main className="flex-grow p-8 ml-64 overflow-y-auto min-h-screen">
                {activeTab === 'sections' && (
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-white">Manage Section Visibility</h2>
                        <p className="text-slate-400 mb-6">Use these toggles to show or hide sections on your live portfolio.</p>
                        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                            <p className="text-slate-300 mb-4 font-semibold">Turn a section "On" to make it visible.</p>
                            {sections.map((section, index) => (
                                <div key={section.id} className="flex items-center justify-between p-3 border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50 transition-colors">
                                    <span className="text-lg font-semibold capitalize">{section.title}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={section.visible} onChange={() => {
                                            const newSections = [...sections];
                                            newSections[index].visible = !newSections[index].visible;
                                            setSections(newSections);
                                        }} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => saveData('sectionsConfig', sections)} className="mt-6 bg-cyan-500 hover:bg-cyan-600 font-bold py-2 px-4 rounded transition-colors shadow-lg hover:shadow-cyan-500/20">Save Section Visibility</button>
                    </div>
                )}
                
                {activeTab === 'personal' && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Edit Personal & Education Info</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Personal Details</h3>
                              {renderInput("Name", personalInfo.name, e => setPersonalInfo({...personalInfo, name: e.target.value}))}
                              {renderInput("Title", personalInfo.title, e => setPersonalInfo({...personalInfo, title: e.target.value}))}
                              {renderInput("Email", personalInfo.email, e => setPersonalInfo({...personalInfo, email: e.target.value}), "email")}
                              {renderInput("Phone", personalInfo.phone, e => setPersonalInfo({...personalInfo, phone: e.target.value}), "tel")}
                              {renderInput("Location", personalInfo.location, e => setPersonalInfo({...personalInfo, location: e.target.value}))}
                              {renderInput("LinkedIn URL", personalInfo.linkedin, e => setPersonalInfo({...personalInfo, linkedin: e.target.value}), "url")}
                              {renderInput("Profile Image URL", personalInfo.profileImageUrl, e => setPersonalInfo({...personalInfo, profileImageUrl: e.target.value}), "url")}
                              {renderInput("Resume Download URL (PDF Link)", personalInfo.resumeUrl || '', e => setPersonalInfo({...personalInfo, resumeUrl: e.target.value}), "url", "e.g., https://example.com/resume.pdf")}
                              {renderTextarea("Summary", personalInfo.summary, e => setPersonalInfo({...personalInfo, summary: e.target.value}))}
                              <button onClick={() => saveData('personalInfo', personalInfo)} className="mt-4 bg-cyan-500 hover:bg-cyan-600 font-bold py-2 px-4 rounded transition-colors shadow-lg hover:shadow-cyan-500/20">Save Personal Info</button>
                          </div>
                          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 h-fit">
                            <h3 className="text-xl font-semibold mb-4 text-cyan-400">Education</h3>
                            {renderInput("Degree", educationData.degree, e => setEducationData({...educationData, degree: e.target.value}))}
                            {renderInput("Institution", educationData.institution, e => setEducationData({...educationData, institution: e.target.value}))}
                            {renderInput("Duration", educationData.duration, e => setEducationData({...educationData, duration: e.target.value}))}
                            {renderInput("GPA", educationData.gpa, e => setEducationData({...educationData, gpa: e.target.value}))}
                            <button onClick={() => saveData('educationData', educationData)} className="mt-4 bg-cyan-500 hover:bg-cyan-600 font-bold py-2 px-4 rounded transition-colors shadow-lg hover:shadow-cyan-500/20">Save Education</button>
                          </div>
                        </div>
                    </div>
                )}
                
                {['experience', 'skills', 'awards', 'projects', 'certifications', 'articles'].includes(activeTab) && (
                  <div>
                      <h2 className="text-3xl font-bold mb-6 capitalize">Edit {activeTab}</h2>
                      {
                        {
                          'experience': experienceData.map((item, index) => (
                              <div key={index} className="bg-slate-800 p-6 rounded-lg mb-4 border border-slate-700">
                                  {renderInput("Date", item.date, e => handleItemChange(setExperienceData, index, 'date', e.target.value))}
                                  {renderInput("Title", item.title, e => handleItemChange(setExperienceData, index, 'title', e.target.value))}
                                  {renderInput("Company", item.company, e => handleItemChange(setExperienceData, index, 'company', e.target.value))}
                                  {renderInput("Company Logo URL", item.logoUrl || '', e => handleItemChange(setExperienceData, index, 'logoUrl', e.target.value), "url")}
                                  {renderTextarea("Description (one per line)", Array.isArray(item.description) ? item.description.join('\n') : '', e => handleItemChange(setExperienceData, index, 'description', e.target.value, true))}
                                  <button onClick={() => handleRemoveItem(setExperienceData, index)} className="text-red-500 hover:text-red-400 mt-2 transition-colors">Remove Experience</button>
                              </div>
                          )),
                           'skills': skillsData.map((item, index) => (
                              <div key={index} className="bg-slate-800 p-6 rounded-lg mb-4 border border-slate-700 flex items-end gap-4">
                                  <div className="flex-grow">{renderInput("Skill Name", item.name, e => handleItemChange(setSkillsData, index, 'name', e.target.value))}</div>
                                  <div>{renderInput("Level (0-100)", String(item.level), e => handleItemChange(setSkillsData, index, 'level', Number(e.target.value)), "number")}</div>
                                  <button onClick={() => handleRemoveItem(setSkillsData, index)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded h-fit transition-colors">Remove</button>
                              </div>
                          )),
                           'awards': awardsData.map((item, index) => (
                               <div key={index} className="bg-slate-800 p-6 rounded-lg mb-4 border border-slate-700">
                                  {renderInput("Award Name", item.name, e => handleItemChange(setAwardsData, index, 'name', e.target.value))}
                                  {renderInput("Date", item.date, e => handleItemChange(setAwardsData, index, 'date', e.target.value))}
                                  {renderTextarea("Description", item.description, e => handleItemChange(setAwardsData, index, 'description', e.target.value))}
                                  <button onClick={() => handleRemoveItem(setAwardsData, index)} className="text-red-500 hover:text-red-400 mt-2 transition-colors">Remove Award</button>
                               </div>
                           )),
                           'projects': projectsData.map((item, index) => (
                               <div key={index} className="bg-slate-800 p-6 rounded-lg mb-4 border border-slate-700">
                                   {renderInput("Title", item.title, e => handleItemChange(setProjectsData, index, 'title', e.target.value))}
                                   {renderInput("Image URL", item.imageUrl, e => handleItemChange(setProjectsData, index, 'imageUrl', e.target.value), "url")}
                                   {renderTextarea("Description", item.description, e => handleItemChange(setProjectsData, index, 'description', e.target.value))}
                                   {renderInput("Tags (comma separated)", Array.isArray(item.tags) ? item.tags.join(',') : '', e => handleItemChange(setProjectsData, index, 'tags', e.target.value.split(',')))}
                                   {renderInput("Live URL", item.liveUrl || '', e => handleItemChange(setProjectsData, index, 'liveUrl', e.target.value), "url")}
                                   {renderInput("Source URL", item.sourceUrl || '', e => handleItemChange(setProjectsData, index, 'sourceUrl', e.target.value), "url")}
                                   <button onClick={() => handleRemoveItem(setProjectsData, index)} className="text-red-500 hover:text-red-400 mt-2 transition-colors">Remove Project</button>
                               </div>
                           )),
                          'certifications': certificationsData.map((item, index) => (
                               <div key={index} className="bg-slate-800 p-6 rounded-lg mb-4 border border-slate-700">
                                  {renderInput("Name", item.name, e => handleItemChange(setCertificationsData, index, 'name', e.target.value))}
                                  {renderInput("Issuer", item.issuer, e => handleItemChange(setCertificationsData, index, 'issuer', e.target.value))}
                                  {renderInput("Date", item.date, e => handleItemChange(setCertificationsData, index, 'date', e.target.value))}
                                  {renderInput("Issuer Logo URL (e.g. AWS logo)", item.imageUrl || '', e => handleItemChange(setCertificationsData, index, 'imageUrl', e.target.value), "url")}
                                  {renderInput("Credential / Certificate Image URL (The View Link)", item.credentialUrl || '', e => handleItemChange(setCertificationsData, index, 'credentialUrl', e.target.value), "url", "Link to certificate image or validation page")}
                                  <button onClick={() => handleRemoveItem(setCertificationsData, index)} className="text-red-500 hover:text-red-400 mt-2 transition-colors">Remove Certification</button>
                               </div>
                          )),
                          'articles': articlesData.map((item, index) => (
                               <div key={index} className="bg-slate-800 p-6 rounded-lg mb-4 border border-slate-700">
                                  {renderInput("Title", item.title, e => handleItemChange(setArticlesData, index, 'title', e.target.value))}
                                  {renderInput("Category", item.category, e => handleItemChange(setArticlesData, index, 'category', e.target.value))}
                                  {renderInput("Image URL", item.imageUrl, e => handleItemChange(setArticlesData, index, 'imageUrl', e.target.value), "url")}
                                  {renderInput("Article Link URL", item.link || '', e => handleItemChange(setArticlesData, index, 'link', e.target.value), "url", "e.g. https://medium.com/...")}
                                  {renderTextarea("Description", item.description, e => handleItemChange(setArticlesData, index, 'description', e.target.value))}
                                  <button onClick={() => handleRemoveItem(setArticlesData, index)} className="text-red-500 hover:text-red-400 mt-2 transition-colors">Remove Article</button>
                               </div>
                          ))
                        }[activeTab]
                      }
                      <div className="flex gap-4 mt-6">
                        <button onClick={() => {
                          const actions = {
                            'experience': () => handleAddItem(setExperienceData, { date: '', title: '', company: '', description: [] }),
                            'skills': () => handleAddItem(setSkillsData, { name: '', level: 80 }),
                            'awards': () => handleAddItem(setAwardsData, { name: '', date: '', description: '' }),
                            'projects': () => handleAddItem(setProjectsData, { title: '', description: '', imageUrl: '', tags: [] }),
                            'certifications': () => handleAddItem(setCertificationsData, { name: '', issuer: '', date: '', credentialUrl: '' }),
                            'articles': () => handleAddItem(setArticlesData, { title: '', description: '', imageUrl: '', category: '', link: '' }),
                          };
                          actions[activeTab as keyof typeof actions]();
                        }} className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded transition-colors shadow-lg hover:shadow-green-600/20">+ Add Item</button>
                        <button onClick={handleSaveCurrentTab} className="bg-cyan-500 hover:bg-cyan-600 font-bold py-2 px-4 rounded transition-colors shadow-lg hover:shadow-cyan-500/20">Save {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</button>
                      </div>
                  </div>
                )}
            </main>
        </div>
    );
};

export default Admin;
