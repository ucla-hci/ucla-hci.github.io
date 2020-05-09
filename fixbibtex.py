#!/usr/bin/env python

# from sys import argv
import os 

if __name__ == "__main__":
	text = open('.bibtex', 'r').read()
	text = text.replace('\n', '<br>')
	text = text.replace('  ', '&nbsp; &nbsp; &nbsp; &nbsp;')
	text = text.replace('\t', '&nbsp; &nbsp; &nbsp; &nbsp;')
	text = text.replace('\&', '&amp;')
	print(text)
	os.system("echo '%s' | pbcopy" % text)