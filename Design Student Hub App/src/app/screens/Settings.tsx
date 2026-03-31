import { motion } from 'motion/react';
import { User, Moon, Sun, Bell, Lock, HelpCircle, LogOut, ChevronRight, Laptop, Smartphone, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  interface SettingItem {
    icon: any;
    label: string;
    value?: string | boolean;
    action: () => void;
    toggle?: boolean;
    destructive?: boolean;
  }

  interface SettingSection {
    title: string;
    items: SettingItem[];
  }

  const settingsSections: SettingSection[] = [
    {
      title: 'Account & Security',
      items: [
        {
          icon: User,
          label: 'Personal Information',
          value: user?.name || 'Set your name',
          action: () => console.log('Profile'),
        },
        {
          icon: ShieldCheck,
          label: 'Privacy & Data',
          action: () => console.log('Privacy'),
        },
        {
          icon: Lock,
          label: 'Change Password',
          action: () => console.log('Password'),
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          icon: theme === 'dark' ? Moon : Sun,
          label: 'Color Theme',
          value: theme === 'dark' ? 'Dark Mode' : 'Light Mode',
          toggle: true,
          action: toggleTheme,
        },
        {
            icon: Laptop,
            label: 'System Sync',
            value: 'Enabled',
            action: () => console.log('Sync'),
        }
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          toggle: true,
          value: notificationsEnabled,
          action: () => setNotificationsEnabled(!notificationsEnabled),
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Knowledge Base',
          action: () => console.log('Help'),
        },
        {
            icon: LogOut,
            label: 'Sign Out',
            action: logout,
            destructive: true,
          },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your account preferences and application settings.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card rounded-[2.5rem] p-8 neu-shadow-light border border-border relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <User className="w-32 h-32 text-primary" />
                </div>
                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                        <span className="text-4xl text-white font-bold">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{user?.name || 'Student'}</h2>
                    <p className="text-sm text-muted-foreground mb-6">{user?.email || 'N/A'}</p>
                    <button className="px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all">
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
                    <div className="text-center">
                        <div className="text-xl font-bold mb-0.5">12</div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Tasks</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold mb-0.5">4.8</div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">GPA</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold mb-0.5">156</div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Streak</div>
                    </div>
                </div>
            </motion.div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[2rem] p-6 border border-primary/20">
                <div className="flex items-center gap-3 mb-2 text-primary">
                    <Smartphone className="w-5 h-5" />
                    <span className="font-bold">Mobile App</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Sync your progress on the go. Scan the QR code in your dashboard to download the mobile companion.
                </p>
            </div>
        </div>

        {/* Right Column: Settings Sections */}
        <div className="lg:col-span-2 space-y-8">
            {settingsSections.map((section, sectionIndex) => (
                <motion.div
                    key={section.title}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: sectionIndex * 0.1 }}
                >
                    <h2 className="text-xl font-bold px-4 mb-4">{section.title}</h2>
                    <div className="bg-card rounded-[2rem] neu-shadow-light border border-border overflow-hidden">
                        {section.items.map((item, itemIndex) => (
                            <button
                                key={item.label}
                                onClick={item.action}
                                className={`w-full px-6 py-5 flex items-center justify-between hover:bg-muted/30 transition-all border-b border-border last:border-b-0 group ${
                                    item.destructive ? 'text-destructive' : ''
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                                        item.destructive 
                                            ? 'bg-destructive/10 text-destructive' 
                                            : 'bg-muted/50 text-primary group-hover:scale-110'
                                    }`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold">{item.label}</div>
                                        {item.value && typeof item.value === 'string' && (
                                            <div className="text-xs text-muted-foreground">{item.value}</div>
                                        )}
                                    </div>
                                </div>

                                {item.toggle ? (
                                    <div
                                        className={`w-14 h-7 rounded-full p-1 transition-colors ${
                                            item.value ? 'bg-primary' : 'bg-muted'
                                        }`}
                                    >
                                        <motion.div
                                            className="w-5 h-5 bg-white rounded-full shadow-md"
                                            animate={{ x: item.value ? 28 : 0 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </div>
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>
            ))}

            <div className="text-center pt-4 text-xs text-muted-foreground">
                <p>Student Hub Desktop Experience v1.0.0</p>
                <p>© 2026 Student Hub Ecosystem</p>
            </div>
        </div>
      </div>
    </div>
  );
}
