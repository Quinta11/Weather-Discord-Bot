# -*- coding: utf-8 -*-
"""
Created on Sat Sep 30 23:16:21 2023

@author: Adrian Quintero
"""
# Imports
import sys
import tropycal.tracks as tracks
import datetime as dt

# Initializing variables
basin = sys.argv[1]
name = sys.argv[2]
year = sys.argv[3]
isCurrentYear=False
basinError=False

# Check if year passed is same as current year to determine best track flag
if int(year) == dt.datetime.now().year:
    isCurrentYear=True
    print("Year input matches current year. isCurrentYear flag set to " + str(isCurrentYear) + ".")

# Determine what basin to read information from based on basin acronym passed
match basin:
    case "natl":
        basin = tracks.TrackDataset(basin='north_atlantic',source='hurdat',include_btk=isCurrentYear)
    case "epac":
        basin = tracks.TrackDataset(basin='east_pacific',source='hurdat',include_btk=isCurrentYear)
    case "wpac":
        basin = tracks.TrackDataset(basin='west_pacific',source='ibtracs',include_btk=isCurrentYear)
    case "nio":
        basin = tracks.TrackDataset(basin='north_indian',source='ibtracs',include_btk=isCurrentYear)
    case "swio":
        basin = tracks.TrackDataset(basin='south_indian',source='ibtracs',include_btk=isCurrentYear)
    case "sio":
        basin = tracks.TrackDataset(basin='south_indian',source='ibtracs',include_btk=isCurrentYear)
    case "aus":
        basin = tracks.TrackDataset(basin='australia',source='ibtracs',include_btk=isCurrentYear)
    case "spac":
        basin = tracks.TrackDataset(basin='south_pacific',source='ibtracs',include_btk=isCurrentYear)
    case "satl":
        basin = tracks.TrackDataset(basin='south_atlantic',source='ibtracs',include_btk=isCurrentYear)
    case _:
        basinError=True

# Select storm specified by user
if not basinError:
    storm_id = basin.get_storm_id((name,int(year)))
    storm = basin.get_storm(storm_id)
    storm.plot(domain='dynamic_tropical',prop={'ms':10,'linecolor':'category','linewidth':2.0}).figure.savefig("./python_scripts/exports/generate_storm_track/track.png",bbox_inches='tight')
                                                                                                                                            

