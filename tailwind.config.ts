import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				nori: {
					DEFAULT: 'hsl(var(--nori-red))',
					red: 'hsl(var(--nori-red))',
					light: 'hsl(var(--nori-red-light))',
					dark: 'hsl(var(--nori-red-dark))',
					black: 'hsl(var(--nori-black))',
					surface: 'hsl(var(--nori-surface))',
					'surface-2': 'hsl(var(--nori-surface-2))',
					line: 'hsl(var(--nori-line))',
					gold: 'hsl(var(--nori-gold))'
				},
				/* Legacy aliases pointed at the new brand. */
				ocean: {
					DEFAULT: 'hsl(var(--nori-red))',
					light: 'hsl(var(--nori-red-light))',
					deep: 'hsl(var(--nori-red-dark))'
				},
				glovo: {
					DEFAULT: 'hsl(var(--nori-red))',
					orange: 'hsl(var(--nori-red))',
					orangeLight: 'hsl(var(--nori-red-light))',
					green: 'hsl(var(--nori-text-muted))',
					greenLight: 'hsl(var(--nori-text-muted))',
					purple: 'hsl(var(--nori-red))',
					purpleLight: 'hsl(var(--nori-red-light))',
					pink: 'hsl(var(--nori-red))',
					light: 'hsl(var(--nori-red-light))',
					deep: 'hsl(var(--nori-red-dark))'
				},
				seafoam: 'hsl(var(--nori-text-muted))',
				coral: 'hsl(var(--nori-red))',
				wave: 'hsl(var(--wave))',
				gold: 'hsl(var(--nori-gold))',
				'cart-purple': 'hsl(var(--nori-red))'
			},
			backgroundImage: {
				'gradient-nori': 'var(--gradient-nori)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-glovo': 'var(--gradient-nori)',
				'gradient-glovo-green': 'var(--gradient-nori)',
				'gradient-glovo-alt': 'var(--gradient-nori)',
				'gradient-wave': 'var(--gradient-wave)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-footer': 'var(--gradient-footer)'
			},
			fontFamily: {
				sans: ['Montserrat', 'system-ui', 'sans-serif'],
				display: ['Montserrat', 'sans-serif']
			},
			boxShadow: {
				'glovo': 'var(--shadow-glovo)',
				'float': 'var(--shadow-float)',
				'deep': 'var(--shadow-deep)'
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)',
				'bounce': 'var(--transition-bounce)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
