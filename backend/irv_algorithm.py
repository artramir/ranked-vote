"""
Instant Runoff Voting (IRV) Algorithm Implementation

This module implements the IRV algorithm for ranked-choice voting elections.
Also known as "Alternative Vote" or "Single Transferable Vote (STV)" for single winner.

Algorithm Overview:
1. Count first-choice votes for each candidate
2. If a candidate has >50% of active votes, they win
3. Otherwise, eliminate the candidate with the fewest votes
4. Transfer their votes to the next available preference on each ballot
5. Repeat until a winner is determined

Special Cases Handled:
- Tie breaking: When multiple candidates have the same lowest vote count
- Exhausted ballots: When a ballot has no remaining valid choices
- Multiple simultaneous eliminations in case of ties
"""

from collections import defaultdict
from typing import List, Dict, Tuple, Optional
import random


class IRVResult:
    """Container for IRV election results"""
    
    def __init__(self):
        self.rounds = []  # List of round data
        self.winner = None
        self.winner_party_id = None
        self.total_ballots = 0
        self.exhausted_ballots = 0
        self.tied = False
        self.tie_candidates = []
    
    def to_dict(self):
        """Convert to JSON-serializable dictionary"""
        return {
            "winner": self.winner,
            "winner_party_id": self.winner_party_id,
            "total_ballots": self.total_ballots,
            "exhausted_ballots": self.exhausted_ballots,
            "tied": self.tied,
            "tie_candidates": self.tie_candidates,
            "rounds": self.rounds
        }


def compute_irv_results(ballots: List[Dict], parties: Dict[int, Dict]) -> IRVResult:
    """
    Compute IRV results from a list of ballots
    
    Args:
        ballots: List of ballot dictionaries with 'rankings' field (list of party IDs in order)
        parties: Dictionary mapping party_id to party data (name, abbreviation, etc.)
    
    Returns:
        IRVResult object with complete election results
    """
    result = IRVResult()
    result.total_ballots = len(ballots)
    
    if result.total_ballots == 0:
        return result
    
    # Initialize: track which candidates are still active
    active_candidates = set(parties.keys())
    
    # Track current preference index for each ballot
    # ballot_state[i] = index of current preference being counted for ballot i
    ballot_states = [0] * len(ballots)
    
    round_number = 1
    
    while True:
        # Count votes in this round
        vote_counts = defaultdict(int)
        exhausted_this_round = 0
        
        for ballot_idx, ballot in enumerate(ballots):
            rankings = ballot.get('rankings', [])
            current_index = ballot_states[ballot_idx]
            
            # Find the next active candidate in this ballot's rankings
            vote_assigned = False
            while current_index < len(rankings):
                candidate_id = rankings[current_index]
                
                # Check if this candidate is still active
                if candidate_id in active_candidates:
                    vote_counts[candidate_id] += 1
                    ballot_states[ballot_idx] = current_index
                    vote_assigned = True
                    break
                
                # Skip eliminated candidates
                current_index += 1
            
            # Ballot is exhausted if no active candidate found
            if not vote_assigned:
                exhausted_this_round += 1
                ballot_states[ballot_idx] = len(rankings)  # Mark as exhausted
        
        # Calculate active votes (total - exhausted)
        active_votes = result.total_ballots - exhausted_this_round
        
        # Build round summary
        round_data = {
            "round": round_number,
            "active_candidates": len(active_candidates),
            "active_votes": active_votes,
            "exhausted_ballots": exhausted_this_round,
            "votes": {}
        }
        
        for candidate_id in active_candidates:
            votes = vote_counts.get(candidate_id, 0)
            # Calculate percentage based on total ballots cast, not active votes
            percentage = (votes / result.total_ballots * 100) if result.total_ballots > 0 else 0
            round_data["votes"][candidate_id] = {
                "party_name": parties[candidate_id]["name"],
                "abbreviation": parties[candidate_id]["abbreviation"],
                "first_lastname": parties[candidate_id]["first_lastname"],
                "votes": votes,
                "percentage": round(percentage, 2)
            }
        
        result.rounds.append(round_data)
        
        # Check for winner: candidate with >50% of active votes
        for candidate_id, votes in vote_counts.items():
            if active_votes > 0 and votes > (active_votes / 2):
                result.winner = parties[candidate_id]["first_lastname"]
                result.winner_party_id = candidate_id
                result.exhausted_ballots = exhausted_this_round
                round_data["eliminated"] = []
                round_data["reason"] = f"Ganador alcanzó mayoría con {votes}/{active_votes} votos"
                return result
        
        # Check if only one candidate remains
        if len(active_candidates) == 1:
            winner_id = list(active_candidates)[0]
            result.winner = parties[winner_id]["first_lastname"]
            result.winner_party_id = winner_id
            result.exhausted_ballots = exhausted_this_round
            round_data["eliminated"] = []
            round_data["reason"] = "Último candidato restante"
            return result
        
        # Check if all remaining candidates are tied
        if len(set(vote_counts.values())) == 1 and len(vote_counts) == len(active_candidates):
            # Perfect tie among all remaining candidates
            result.tied = True
            result.tie_candidates = [
                {
                    "party_id": cid,
                    "first_lastname": parties[cid]["first_lastname"],
                    "votes": vote_counts.get(cid, 0)
                }
                for cid in active_candidates
            ]
            result.exhausted_ballots = exhausted_this_round
            round_data["eliminated"] = []
            round_data["reason"] = "Empate perfecto - no es posible eliminación"
            return result
        
        # Find candidate(s) with fewest votes to eliminate
        min_votes = min(vote_counts.get(cid, 0) for cid in active_candidates)
        candidates_to_eliminate = [
            cid for cid in active_candidates 
            if vote_counts.get(cid, 0) == min_votes
        ]
        
        # Record elimination
        round_data["eliminated"] = [
            {
                "party_id": cid,
                "first_lastname": parties[cid]["first_lastname"],
                "abbreviation": parties[cid]["abbreviation"],
                "votes": vote_counts.get(cid, 0)
            }
            for cid in candidates_to_eliminate
        ]
        
        if len(candidates_to_eliminate) == 1:
            round_data["reason"] = f"Eliminado candidato con menos votos ({min_votes})"
        else:
            round_data["reason"] = f"Eliminados {len(candidates_to_eliminate)} candidatos empatados con menos votos ({min_votes})"
        
        # Eliminate candidates
        for candidate_id in candidates_to_eliminate:
            active_candidates.remove(candidate_id)
        
        # Safety check: prevent infinite loop
        if round_number > 50:
            result.tied = True
            result.tie_candidates = [
                {
                    "party_id": cid,
                    "first_lastname": parties[cid]["first_lastname"],
                    "votes": vote_counts.get(cid, 0)
                }
                for cid in active_candidates
            ]
            result.exhausted_ballots = exhausted_this_round
            round_data["reason"] = "Máximo de rondas excedido - detención de seguridad del algoritmo"
            return result
        
        round_number += 1


def get_ballot_journey(ballot_rankings: List[int], parties: Dict[int, Dict], election_result: IRVResult) -> Dict:
    """
    Trace how a single ballot's vote transferred through elimination rounds
    
    Args:
        ballot_rankings: List of party IDs representing voter's preferences
        parties: Dictionary mapping party_id to party data
        election_result: The computed IRV result with all rounds
    
    Returns:
        Dictionary with ballot journey information
    """
    journey = {
        "original_rankings": [
            {
                "rank": idx + 1,
                "party_id": party_id,
                "first_lastname": parties[party_id]["first_lastname"],
                "abbreviation": parties[party_id]["abbreviation"]
            }
            for idx, party_id in enumerate(ballot_rankings)
            if party_id in parties
        ],
        "transfers": []
    }
    
    current_choice_index = 0
    
    for round_data in election_result.rounds:
        if current_choice_index >= len(ballot_rankings):
            # Ballot exhausted
            journey["transfers"].append({
                "round": round_data["round"],
                "status": "exhausted",
                "message": "No remaining preferences available"
            })
            continue
        
        current_candidate_id = ballot_rankings[current_choice_index]
        
        # Skip candidates not in the parties dict (invalid IDs)
        if current_candidate_id not in parties:
            current_choice_index += 1
            continue
        
        # Check if current choice was eliminated this round
        eliminated_ids = [e["party_id"] for e in round_data.get("eliminated", [])]
        
        if current_candidate_id in eliminated_ids:
            journey["transfers"].append({
                "round": round_data["round"],
                "voted_for": parties[current_candidate_id]["first_lastname"],
                "abbreviation": parties[current_candidate_id]["abbreviation"],
                "status": "eliminated",
                "message": f"{parties[current_candidate_id]['first_lastname']} fue eliminado"
            })
            # Move to next preference
            current_choice_index += 1
        elif current_candidate_id in round_data["votes"]:
            # Candidate is active and receiving votes this round
            journey["transfers"].append({
                "round": round_data["round"],
                "voted_for": parties[current_candidate_id]["first_lastname"],
                "abbreviation": parties[current_candidate_id]["abbreviation"],
                "status": "active",
                "votes": round_data["votes"][current_candidate_id]["votes"],
                "percentage": round_data["votes"][current_candidate_id]["percentage"]
            })
        else:
            # Candidate was eliminated in a previous round - skip to next preference
            journey["transfers"].append({
                "round": round_data["round"],
                "voted_for": parties[current_candidate_id]["first_lastname"],
                "abbreviation": parties[current_candidate_id]["abbreviation"],
                "status": "already_eliminated",
                "message": f"{parties[current_candidate_id]['first_lastname']} fue eliminado en una ronda anterior"
            })
            current_choice_index += 1
    
    return journey
