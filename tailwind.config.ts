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
				ocean: {
					DEFAULT: 'hsl(var(--glovo-purple))',
					light: 'hsl(var(--glovo-purple-light))',
					deep: 'hsl(var(--deep-purple))'
				},
				glovo: {
					DEFAULT: 'hsl(var(--glovo-purple))',
					orange: 'hsl(var(--glovo-orange))',
					orangeLight: 'hsl(var(--glovo-orange-light))',
					green: 'hsl(var(--glovo-green))',
					greenLight: 'hsl(var(--glovo-green-light))',
					purple: 'hsl(var(--glovo-purple))',
					purpleLight: 'hsl(var(--glovo-purple-light))',
					pink: 'hsl(var(--glovo-pink))',
					light: 'hsl(var(--glovo-purple-light))',
					deep: 'hsl(var(--deep-purple))'
				},
				seafoam: 'hsl(var(--glovo-green))',
				coral: 'hsl(var(--glovo-orange))',
				wave: 'hsl(var(--wave))',
				gold: 'hsl(var(--gold))',
				'cart-purple': 'hsl(var(--cart-purple))'
			},
			backgroundImage: {
				'gradient-glovo': 'var(--gradient-glovo)',
				'gradient-glovo-green': 'var(--gradient-glovo-green)',
				'gradient-glovo-alt': 'var(--gradient-glovo-alt)',
				'gradient-wave': 'var(--gradient-wave)',
				'gradient-hero': 'var(--gradient-hero)'
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
