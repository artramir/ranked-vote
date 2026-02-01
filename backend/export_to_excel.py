"""
Convert exported ballots JSON to Excel for manual review
Usage: python export_to_excel.py ballots_raw.json
"""

import json
import sys
import pandas as pd
from collections import Counter

if len(sys.argv) < 2:
    print("Usage: python export_to_excel.py ballots_raw.json")
    sys.exit(1)

# Load JSON
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    data = json.load(f)

ballots = data['ballots']
parties = {p['id']: p for p in data['parties']}

print(f"Total ballots: {len(ballots)}")

# Convert to DataFrame
rows = []
for ballot in ballots:
    rankings = ballot['rankings']
    row = {
        'id': ballot['id'],
        'timestamp': ballot['timestamp'],
        'num_candidates': len(rankings),
        'rankings_raw': str(rankings),
    }
    
    # Add individual candidate columns
    for i, party_id in enumerate(rankings[:5], 1):
        party = parties.get(party_id, {})
        row[f'choice_{i}_id'] = party_id
        row[f'choice_{i}_name'] = f"{party.get('first_lastname', 'Unknown')} ({party.get('abbreviation', '?')})"
    
    rows.append(row)

df = pd.DataFrame(rows)

# Add analysis columns
df['timestamp'] = pd.to_datetime(df['timestamp'])
df = df.sort_values('timestamp')

# Identify duplicate patterns
rankings_strings = df['rankings_raw'].tolist()
pattern_counts = Counter(rankings_strings)
df['pattern_count'] = df['rankings_raw'].map(pattern_counts)

# Flag suspicious votes
df['suspicious'] = ''
df.loc[df['pattern_count'] > 50, 'suspicious'] = 'High duplicate pattern'
df.loc[(df['num_candidates'] == 1) & (df['pattern_count'] > 10), 'suspicious'] = 'Single candidate spam'

# Create summary sheet
summary_data = []
for pattern, count in pattern_counts.most_common(30):
    summary_data.append({
        'pattern': pattern,
        'count': count,
        'example_id': df[df['rankings_raw'] == pattern].iloc[0]['id']
    })

summary_df = pd.DataFrame(summary_data)

# Save to Excel with multiple sheets
output_file = sys.argv[1].replace('.json', '_analysis.xlsx')
with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
    df.to_excel(writer, sheet_name='All Ballots', index=False)
    summary_df.to_excel(writer, sheet_name='Pattern Summary', index=False)
    
    # Suspicious votes only
    suspicious_df = df[df['suspicious'] != '']
    suspicious_df.to_excel(writer, sheet_name='Suspicious Votes', index=False)

print(f"\n✅ Created: {output_file}")
print(f"   - All Ballots: {len(df)} rows")
print(f"   - Suspicious: {len(suspicious_df)} rows")
print(f"   - Pattern Summary: {len(summary_df)} unique patterns")
print(f"\nMost common patterns:")
for i, row in summary_df.head(10).iterrows():
    print(f"  {row['pattern']}: {row['count']} votes")
